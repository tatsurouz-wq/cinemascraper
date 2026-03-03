"""109シネマズ スクレイパー"""

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
from src.utils.browser import get_browser, get_page, rate_limit

# 109シネマズ 劇場コード（109cinemas.net ログインフォームより）
THEATER_CODES: dict[str, str] = {
    "プレミアム新宿": "X1",
    "木場": "20",
    "二子玉川": "T1",
    "グランベリーパーク": "G1",
    "川崎": "I1",
    "港北": "13",
    "湘南": "R1",
    "ムービル": "72",
    "ゆめが丘": "Z1",
    "佐野": "C1",
    "菖蒲": "M1",
}

# 劇場スラッグ（URL用）
THEATER_SLUGS: dict[str, str] = {
    "プレミアム新宿": "premiumshinjuku",
    "木場": "kiba",
    "二子玉川": "futakotamagawa",
    "グランベリーパーク": "grandberrypark",
    "川崎": "kawasaki",
    "港北": "kohoku",
    "湘南": "shonan",
    "ムービル": "movil",
    "ゆめが丘": "yumegaoka",
    "佐野": "sano",
    "菖蒲": "shobu",
}

BASE_URL = "https://109cinemas.net"


def _detect_format(text: str) -> ScreeningFormat:
    """フォーマットテキストからScreeningFormatを判定"""
    text_lower = text.lower()
    if "imax" in text_lower:
        return ScreeningFormat.IMAX
    if "screenx" in text_lower:
        return ScreeningFormat.SCREENX
    if "4dx" in text_lower:
        return ScreeningFormat.FOUR_DX
    if "mx4d" in text_lower:
        return ScreeningFormat.MX4D
    if "dolby" in text_lower or "atmos" in text_lower:
        return ScreeningFormat.DOLBY_ATMOS
    return ScreeningFormat.STANDARD_2D


def _detect_language(title: str) -> str:
    """タイトルから言語を判定"""
    if "字幕" in title:
        return "字幕"
    if "吹替" in title:
        return "吹替"
    return "日本語"


def _parse_duration(text: str) -> int | None:
    """上映時間テキストから分数を抽出"""
    match = re.search(r"(\d+)分", text)
    return int(match.group(1)) if match else None


class Cinema109Scraper(BaseScraper):
    """109シネマズ スクレイパー"""

    def _build_schedule_url(self, theater: Theater, target_date: date) -> str:
        """スケジュールページのURLを構築"""
        slug = THEATER_SLUGS.get(theater.area, theater.area.lower())
        code = THEATER_CODES.get(theater.area, "I1")
        date_str = target_date.strftime("%Y%m%d")
        return f"{BASE_URL}/{slug}/schedules/{date_str}.html?theater_code={code}"

    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        """1劇場・1日分のスケジュールを取得"""
        url = self._build_schedule_url(theater, target_date)

        async with get_browser() as browser:
            async with get_page(browser) as page:
                await page.goto(url, wait_until="domcontentloaded")
                movies = await self._parse_schedule_page(page)

        return Schedule(
            theater=theater,
            date=target_date,
            movies=movies,
            scraped_at=datetime.now(),
        )

    async def _parse_schedule_page(self, page: Page) -> list[Movie]:
        """スケジュールページをパースして映画リストを返す"""
        movies: list[Movie] = []
        articles = await page.query_selector_all("#timetable article")

        for article in articles:
            movie = await self._parse_article(article)
            if movie:
                movies.append(movie)

        return movies

    async def _parse_article(self, article) -> Movie | None:
        """1つのarticle要素から映画情報を抽出"""
        # タイトル取得
        h2 = await article.query_selector("header h2")
        if not h2:
            return None
        title = (await h2.inner_text()).strip()

        # 言語判定
        language = _detect_language(title)

        # 上映回を解析
        timetable = await article.query_selector("ul.timetable")
        if not timetable:
            return Movie(title=title)

        screenings = await self._parse_timetable(timetable, language)

        # 上映時間（最初のtheatre liから取得）
        duration = None
        theatre_li = await timetable.query_selector("li.theatre")
        if theatre_li:
            text = await theatre_li.inner_text()
            duration = _parse_duration(text)

        return Movie(title=title, duration_min=duration, screenings=screenings)

    async def _parse_timetable(self, timetable, language: str) -> list[Screening]:
        """timetable ul から全上映回を抽出"""
        screenings: list[Screening] = []
        items = await timetable.query_selector_all("li")

        current_screen = ""
        current_format = ScreeningFormat.STANDARD_2D

        for item in items:
            class_attr = await item.get_attribute("class") or ""

            if "theatre" in class_attr:
                # シアター情報行
                num_el = await item.query_selector(".theatre-num")
                if num_el:
                    num = await num_el.inner_text()
                    current_screen = f"シアター{num.strip()}"

                text = await item.inner_text()
                current_format = _detect_format(text)
                continue

            # 上映回行
            start_el = await item.query_selector("time.start")
            end_el = await item.query_selector("time.end")
            if not start_el or not end_el:
                continue

            start_time = (await start_el.inner_text()).strip()
            end_time = (await end_el.inner_text()).strip()

            # 空席状況
            available_el = await item.query_selector(".available")
            close_el = await item.query_selector(".close")

            if available_el:
                availability = Availability.AVAILABLE
            elif close_el:
                availability = Availability.SOLD_OUT
            else:
                availability = Availability.UNKNOWN

            screenings.append(
                Screening(
                    start_time=start_time,
                    end_time=end_time,
                    screen=current_screen,
                    format=current_format,
                    language=language,
                    availability=availability,
                )
            )

        return screenings
