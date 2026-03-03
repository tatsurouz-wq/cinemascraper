"""TOHOシネマズ スクレイパー"""

from __future__ import annotations

import re
from datetime import date, datetime

from playwright.async_api import Page

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

BASE_URL = "https://www.tohotheater.jp"


def _extract_theater_code(url: str) -> str:
    """URLから劇場コード（3桁）を抽出"""
    match = re.search(r"/schedule/(\d{3})/", url)
    return match.group(1) if match else ""


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


def _parse_time(text: str) -> str:
    """時刻テキストをHH:MM形式に正規化"""
    match = re.search(r"(\d{1,2}):(\d{2})", text)
    if match:
        return f"{int(match.group(1)):02d}:{match.group(2)}"
    return text.strip()


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

                # TOHOは日付タブをクリックして該当日のスケジュールを表示
                await self._select_date(page, target_date)

                # スケジュールコンテンツが動的に読み込まれるのを待つ
                try:
                    await page.wait_for_selector(
                        ".schedule-body-section", timeout=15000
                    )
                except Exception:
                    # スケジュールが表示されない場合は空を返す
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

        # 日付タブを探してクリック
        tabs = await page.query_selector_all(".schedule-tab-inner a")
        for tab in tabs:
            href = await tab.get_attribute("href") or ""
            data_date = await tab.get_attribute("data-date") or ""
            text = await tab.inner_text()

            if date_str in href or date_str in data_date:
                await tab.click()
                await page.wait_for_timeout(2000)
                return

        # 日付の月/日で探す
        month_day = f"{target_date.month}/{target_date.day}"
        for tab in tabs:
            text = await tab.inner_text()
            if month_day in text:
                await tab.click()
                await page.wait_for_timeout(2000)
                return

    async def _parse_schedule_page(self, page: Page) -> list[Movie]:
        """スケジュールページをパースして映画リストを返す"""
        movies: list[Movie] = []

        # TOHOは .schedule-body-section 内に映画ごとのセクション
        sections = await page.query_selector_all(".schedule-body-section")

        for section in sections:
            movie = await self._parse_movie_section(section)
            if movie:
                movies.append(movie)

        return movies

    async def _parse_movie_section(self, section) -> Movie | None:
        """1つの映画セクションから映画情報を抽出"""
        # タイトル取得
        title_el = await section.query_selector(".schedule-body-title a")
        if not title_el:
            title_el = await section.query_selector(".schedule-body-title")
        if not title_el:
            return None

        title = (await title_el.inner_text()).strip()
        if not title:
            return None

        language = _detect_language(title)

        # 上映時間取得
        duration = None
        time_el = await section.query_selector(".schedule-body-time")
        if time_el:
            time_text = await time_el.inner_text()
            match = re.search(r"(\d+)分", time_text)
            if match:
                duration = int(match.group(1))

        # 上映回を解析
        screenings = await self._parse_screenings(section, language)

        return Movie(title=title, duration_min=duration, screenings=screenings)

    async def _parse_screenings(self, section, language: str) -> list[Screening]:
        """上映回情報を抽出"""
        screenings: list[Screening] = []

        # スクリーンごとのブロック
        screen_blocks = await section.query_selector_all(".schedule-body-screen")

        for block in screen_blocks:
            # スクリーン名
            screen_name = ""
            screen_el = await block.query_selector(".schedule-body-screenName")
            if screen_el:
                screen_name = (await screen_el.inner_text()).strip()

            # フォーマット検出
            block_text = await block.inner_text()
            fmt = _detect_format(block_text)

            # 上映時間リスト
            time_items = await block.query_selector_all(".schedule-body-time-item")

            for item in time_items:
                screening = await self._parse_time_item(
                    item, screen_name, fmt, language
                )
                if screening:
                    screenings.append(screening)

        # screen_blocks がない場合、フラットな構造を試す
        if not screen_blocks:
            time_items = await section.query_selector_all(
                ".schedule-body-time-item, .schedule-time a"
            )
            for item in time_items:
                screening = await self._parse_time_item(
                    item, "", ScreeningFormat.STANDARD_2D, language
                )
                if screening:
                    screenings.append(screening)

        return screenings

    async def _parse_time_item(
        self, item, screen: str, fmt: ScreeningFormat, language: str
    ) -> Screening | None:
        """1つの上映回要素からScreeningを生成"""
        text = await item.inner_text()

        # 時刻パターン: "10:00〜12:30" or "10:00 〜 12:30" or separate elements
        time_match = re.search(
            r"(\d{1,2}:\d{2})\s*[〜～\-―]\s*(\d{1,2}:\d{2})", text
        )

        if not time_match:
            # 開始時刻のみのパターン
            start_match = re.search(r"(\d{1,2}:\d{2})", text)
            if not start_match:
                return None
            start_time = _parse_time(start_match.group(1))
            end_time = ""
        else:
            start_time = _parse_time(time_match.group(1))
            end_time = _parse_time(time_match.group(2))

        # 空席状況
        class_attr = await item.get_attribute("class") or ""
        availability = Availability.UNKNOWN

        if "is-purchase" in class_attr or "購入" in text:
            availability = Availability.AVAILABLE
        elif "is-end" in class_attr or "販売終了" in text or "完売" in text:
            availability = Availability.SOLD_OUT
        elif "残りわずか" in text:
            availability = Availability.FEW_LEFT

        return Screening(
            start_time=start_time,
            end_time=end_time,
            screen=screen,
            format=fmt,
            language=language,
            availability=availability,
        )
