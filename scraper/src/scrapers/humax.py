"""HUMAX Cinema (横須賀HUMAXシネマズ等) スクレイパー"""

from __future__ import annotations

import re
from datetime import date, datetime

from playwright.async_api import Page

from src.models import (
    Availability,
    Movie,
    Schedule,
    Screening,
    ScreeningFormat,
    Theater,
)
from src.scrapers.base import BaseScraper
from src.utils.browser import get_browser, get_page


def _detect_language(title: str) -> str:
    if "字幕" in title or "(字)" in title or "（字）" in title:
        return "字幕"
    if "吹替" in title or "(吹)" in title or "（吹）" in title:
        return "吹替"
    return "日本語"


def _parse_availability(item_classes: str, button_text: str) -> Availability:
    """CSS class + ボタンテキストから空席状況を判定"""
    if "status1" in item_classes:
        return Availability.AVAILABLE
    if "status2" in item_classes:
        return Availability.FEW_LEFT
    bt = button_text.strip()
    if "販売終了" in bt or "完売" in bt:
        return Availability.SOLD_OUT
    if "販売前" in bt:
        return Availability.UNKNOWN
    if "購入" in bt:
        return Availability.AVAILABLE
    return Availability.UNKNOWN


class HumaxScraper(BaseScraper):
    """HUMAX Cinema スクレイパー"""

    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        date_str = target_date.strftime("%Y-%m-%d")
        url = f"{theater.url}&ymd={date_str}"

        async with get_browser() as browser:
            async with get_page(browser) as page:
                await page.goto(url, wait_until="domcontentloaded")
                await page.wait_for_selector("div.sc-item", state="attached", timeout=15000)
                movies = await self._parse_schedule(page)

        return Schedule(
            theater=theater,
            date=target_date,
            movies=movies,
            scraped_at=datetime.now(),
        )

    async def _parse_schedule(self, page: Page) -> list[Movie]:
        movies: list[Movie] = []
        items = await page.query_selector_all("div.sc-item")

        for item in items:
            movie = await self._parse_movie(item)
            if movie:
                movies.append(movie)
        return movies

    async def _parse_movie(self, item) -> Movie | None:
        # タイトル
        title_el = await item.query_selector("h3.title")
        if not title_el:
            return None
        title_text = (await title_el.inner_text()).strip()
        # ratingスパンのテキストを除去 (G, PG-12, R15+, R18+ etc.)
        rating_el = await title_el.query_selector("span.rating")
        if rating_el:
            rating_text = (await rating_el.inner_text()).strip()
            title_text = title_text.replace(rating_text, "").strip()

        language = _detect_language(title_text)

        # 上映時間を計算（start_time と end_time の差）
        duration = None

        # 上映回
        screenings: list[Screening] = []
        screening_items = await item.query_selector_all(".items .item")

        for si in screening_items:
            screening = await self._parse_screening(si, language)
            if screening:
                screenings.append(screening)
                # 最初の上映回から duration を計算
                if duration is None and screening.start_time and screening.end_time:
                    try:
                        sh, sm = map(int, screening.start_time.split(":"))
                        eh, em = map(int, screening.end_time.split(":"))
                        d = (eh * 60 + em) - (sh * 60 + sm)
                        if d > 0:
                            duration = d
                    except ValueError:
                        pass

        return Movie(title=title_text, duration_min=duration, screenings=screenings)

    async def _parse_screening(self, item, language: str) -> Screening | None:
        # 時間
        time_el = await item.query_selector("p.time")
        if not time_el:
            return None
        time_html = await time_el.inner_text()
        # "09:40～11:30" or "20:30～22:20★" format
        time_text = time_html.replace("★", "").replace("☆", "").strip()
        m = re.match(r"(\d{1,2}:\d{2})\s*～?\s*(\d{1,2}:\d{2})", time_text)
        if not m:
            return None
        start_time = m.group(1)
        end_time = m.group(2)

        # スクリーン名
        screen = ""
        screen_el = await item.query_selector("p.screen")
        if screen_el:
            screen = (await screen_el.inner_text()).strip()

        # 空席状況
        classes = await item.get_attribute("class") or ""
        button_text = ""
        button_el = await item.query_selector("p.button span")
        if button_el:
            button_text = (await button_el.inner_text()).strip()
        availability = _parse_availability(classes, button_text)

        return Screening(
            start_time=start_time,
            end_time=end_time,
            screen=screen,
            format=ScreeningFormat.STANDARD_2D,
            language=language,
            availability=availability,
        )
