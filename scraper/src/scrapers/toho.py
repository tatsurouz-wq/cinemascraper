"""TOHOシネマズ スクレイパー"""

from __future__ import annotations

import re
from datetime import date, datetime

from playwright.async_api import Page
from rich.console import Console

from src.models import (
    Availability,
    Chain,
    Movie,
    Schedule,
    Screening,
    ScreeningFormat,
    Theater,
)
from src.scrapers.base import BaseScraper
from src.utils.browser import get_browser, get_page

console = Console()
BASE_URL = "https://www.tohotheater.jp"


def _detect_format(text: str) -> ScreeningFormat:
    """フォーマットテキストからScreeningFormatを判定"""
    text_lower = text.lower()
    if "imax" in text_lower:
        return ScreeningFormat.IMAX
    if "4dx" in text_lower:
        return ScreeningFormat.FOUR_DX
    if "mx4d" in text_lower:
        return ScreeningFormat.MX4D
    if "screenx" in text_lower:
        return ScreeningFormat.SCREENX
    if "dolby" in text_lower or "atmos" in text_lower:
        return ScreeningFormat.DOLBY_ATMOS
    return ScreeningFormat.STANDARD_2D


def _detect_language(title: str) -> str:
    """タイトルから言語を判定"""
    if "字幕" in title:
        return "字幕"
    if "吹替" in title or "吹き替え" in title:
        return "吹替"
    return "日本語"


class TohoScraper(BaseScraper):
    """TOHOシネマズ スクレイパー"""

    def _build_schedule_url(self, theater: Theater, target_date: date) -> str:
        """スケジュールページのURLを構築"""
        if theater.url:
            return theater.url
        return f"{BASE_URL}/net/schedule/000/TNPI2000J01.do"

    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        """1劇場・1日分のスケジュールを取得"""
        url = self._build_schedule_url(theater, target_date)

        async with get_browser() as browser:
            async with get_page(browser) as page:
                await page.goto(url, wait_until="domcontentloaded")
                await page.wait_for_timeout(3000)

                # 日付タブをクリック
                await self._select_date(page, target_date)

                # スケジュールが動的に読み込まれるのを待つ
                try:
                    await page.wait_for_selector(
                        ".schedule-body-section-item", timeout=15000
                    )
                except Exception:
                    return Schedule(
                        theater=theater,
                        date=target_date,
                        movies=[],
                        scraped_at=datetime.now(),
                    )

                # 日付切替が正しく行われたか検証
                if not await self._verify_date(page, target_date):
                    console.print(
                        f"[yellow]⚠️ 日付切替未確認: {theater.name} ({target_date}) "
                        f"- スケジュール未公開の可能性[/]"
                    )
                    return Schedule(
                        theater=theater,
                        date=target_date,
                        movies=[],
                        scraped_at=datetime.now(),
                    )

                movies = await self._parse_schedule_page(page)

        return Schedule(
            theater=theater,
            date=target_date,
            movies=movies,
            scraped_at=datetime.now(),
        )

    async def _select_date(self, page: Page, target_date: date) -> None:
        """日付タブをクリックして該当日のスケジュールを表示"""
        date_str = target_date.strftime("%Y%m%d")

        # 日付タブは div.schedule-tab-item で id="YYYYMMDD"
        # CSS セレクタで数字始まりの id は使えないので属性セレクタを使用
        tab = await page.query_selector(f"div.schedule-tab-item[id='{date_str}']")

        if tab:
            # すでに選択されている場合はスキップ
            cls = await tab.get_attribute("class") or ""
            if "is-selected" in cls:
                return
            await tab.click()
            # スケジュールデータが更新されるのを待つ
            await page.wait_for_timeout(3000)

    async def _verify_date(self, page: Page, target_date: date) -> bool:
        """日付切替が正しく行われたか検証"""
        date_str = target_date.strftime("%Y%m%d")

        # 選択中のタブの id が target_date と一致するか確認
        selected = await page.query_selector("div.schedule-tab-item.is-selected")
        if selected:
            selected_id = await selected.get_attribute("id") or ""
            if selected_id == date_str:
                return True
            console.print(
                f"[yellow]  選択中タブ: {selected_id}, 期待: {date_str}[/]"
            )
            return False

        # タブが見つからない場合（日付がタブに存在しない＝スケジュール未公開）
        tab_exists = await page.query_selector(f"div.schedule-tab-item[id='{date_str}']")
        if not tab_exists:
            return False

        return True

    async def _parse_schedule_page(self, page: Page) -> list[Movie]:
        """スケジュールページをパースして映画リストを返す"""
        movies: list[Movie] = []
        items = await page.query_selector_all(".schedule-body-section-item")

        for item in items:
            movie = await self._parse_movie_item(item)
            if movie:
                movies.append(movie)

        return movies

    async def _parse_movie_item(self, item) -> Movie | None:
        """1つの映画アイテムから映画情報を抽出"""
        # タイトル取得
        title_el = await item.query_selector(".schedule-body-title")
        if not title_el:
            return None
        title = (await title_el.inner_text()).strip()
        if not title:
            return None

        language = _detect_language(title)

        # 上映時間取得
        duration = None
        time_el = await item.query_selector(".schedule-body-info .time")
        if time_el:
            time_text = await time_el.inner_text()
            match = re.search(r"(\d+)分", time_text)
            if match:
                duration = int(match.group(1))

        # スクリーンごとのセクション
        screenings = await self._parse_screenings(item, language)

        return Movie(title=title, duration_min=duration, screenings=screenings)

    async def _parse_screenings(self, item, language: str) -> list[Screening]:
        """上映回情報を抽出"""
        screenings: list[Screening] = []

        screen_sections = await item.query_selector_all(".schedule-screen")

        for section in screen_sections:
            # スクリーン名
            screen_name = ""
            screen_title_el = await section.query_selector(".schedule-screen-title")
            if screen_title_el:
                screen_name = (await screen_title_el.inner_text()).strip()

            # フォーマット検出（スクリーンアイコンから）
            icons_text = ""
            icons_el = await section.query_selector(".schedule-screen-icons")
            if icons_el:
                icons_text = await icons_el.inner_text()
            fmt = _detect_format(icons_text or screen_name)

            # 各上映回
            sched_items = await section.query_selector_all(".schedule-item")
            for si in sched_items:
                screening = await self._parse_schedule_item(
                    si, screen_name, fmt, language
                )
                if screening:
                    screenings.append(screening)

        return screenings

    async def _parse_schedule_item(
        self, item, screen: str, fmt: ScreeningFormat, language: str
    ) -> Screening | None:
        """1つの上映回要素からScreeningを生成"""
        start_el = await item.query_selector(".start")
        end_el = await item.query_selector(".end")

        if not start_el:
            return None

        start_time = (await start_el.inner_text()).strip()
        end_time = (await end_el.inner_text()).strip() if end_el else ""

        # 空席状況
        class_attr = await item.get_attribute("class") or ""
        status_el = await item.query_selector(".status")
        status_text = (await status_el.inner_text()).strip() if status_el else ""

        if "販売中" in status_text:
            availability = Availability.AVAILABLE
        elif "残りわずか" in status_text:
            availability = Availability.FEW_LEFT
        elif "販売終了" in status_text or "完売" in status_text:
            availability = Availability.SOLD_OUT
        else:
            availability = Availability.UNKNOWN

        return Screening(
            start_time=start_time,
            end_time=end_time,
            screen=screen,
            format=fmt,
            language=language,
            availability=availability,
        )
