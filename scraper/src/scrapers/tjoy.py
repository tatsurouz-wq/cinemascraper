"""T-Joy (横浜ブルク13等) スクレイパー"""

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


def _detect_format(text: str) -> ScreeningFormat:
    """フォーマットバッジからScreeningFormatを判定"""
    t = text.lower()
    if "imax" in t:
        return ScreeningFormat.IMAX
    if "screenx" in t:
        return ScreeningFormat.SCREENX
    if "4dx" in t:
        return ScreeningFormat.FOUR_DX
    if "dolby" in t or "atmos" in t:
        return ScreeningFormat.DOLBY_ATMOS
    return ScreeningFormat.STANDARD_2D


def _detect_language(title: str) -> str:
    if "字幕" in title:
        return "字幕"
    if "吹替" in title:
        return "吹替"
    return "日本語"


def _parse_availability(status_text: str) -> Availability:
    s = status_text.strip()
    if s in ("購入", "予約/購入"):
        return Availability.AVAILABLE
    if s == "残りわずか":
        return Availability.FEW_LEFT
    if s in ("販売終了", "完売", "終了"):
        return Availability.SOLD_OUT
    return Availability.UNKNOWN


class TjoyScraper(BaseScraper):
    """T-Joy系列スクレイパー（横浜ブルク13等）"""

    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        date_str = target_date.strftime("%Y-%m-%d")
        url = f"{theater.url}?date={date_str}"

        async with get_browser() as browser:
            async with get_page(browser) as page:
                await page.goto(url, wait_until="domcontentloaded")
                await page.wait_for_selector("section.section-container", state="attached", timeout=15000)
                movies = await self._parse_schedule(page)

        return Schedule(
            theater=theater,
            date=target_date,
            movies=movies,
            scraped_at=datetime.now(),
        )

    async def _parse_schedule(self, page: Page) -> list[Movie]:
        movies: list[Movie] = []
        sections = await page.query_selector_all("section.section-container")

        for section in sections:
            movie = await self._parse_section(section)
            if movie:
                movies.append(movie)
        return movies

    async def _parse_section(self, section) -> Movie | None:
        # タイトル
        title_el = await section.query_selector("h5.js-title-film")
        if not title_el:
            return None
        title = (await title_el.inner_text()).strip()

        # フォーマットバッジ
        fmt = ScreeningFormat.STANDARD_2D
        badge = await section.query_selector(".badge")
        if badge:
            badge_text = (await badge.inner_text()).strip()
            fmt = _detect_format(badge_text)

        # 言語
        language = _detect_language(title)

        # 上映時間
        duration = None
        time_el = await section.query_selector(".time-film")
        if time_el:
            text = await time_el.inner_text()
            m = re.search(r"(\d+)分", text)
            if m:
                duration = int(m.group(1))

        # 上映回
        screenings: list[Screening] = []
        items = await section.query_selector_all("li.schedule-box.theater-item")

        for item in items:
            screening = await self._parse_screening(item, fmt, language)
            if screening:
                screenings.append(screening)

        return Movie(title=title, duration_min=duration, screenings=screenings)

    async def _parse_screening(self, item, fmt: ScreeningFormat, language: str) -> Screening | None:
        # 時間
        time_el = await item.query_selector(".schedule-time")
        if not time_el:
            return None
        time_text = (await time_el.inner_text()).strip()
        # "19:00 ～ 20:10" format
        m = re.match(r"(\d{1,2}:\d{2})\s*～\s*(\d{1,2}:\d{2})", time_text)
        if not m:
            return None
        start_time = m.group(1)
        end_time = m.group(2)

        # スクリーン名
        screen = ""
        screen_el = await item.query_selector(".theater-name a")
        if screen_el:
            screen = (await screen_el.inner_text()).strip()

        # 空席状況
        status_el = await item.query_selector(".schedule-status span")
        availability = Availability.UNKNOWN
        if status_el:
            status_text = (await status_el.inner_text()).strip()
            availability = _parse_availability(status_text)

        return Screening(
            start_time=start_time,
            end_time=end_time,
            screen=screen,
            format=fmt,
            language=language,
            availability=availability,
        )
