"""109シネマズ スクレイパーのテスト"""

from datetime import date
from pathlib import Path

import pytest
from playwright.async_api import async_playwright

from src.models import (
    Availability,
    Chain,
    ScreeningFormat,
    Theater,
)
from src.scrapers.cinema109 import (
    Cinema109Scraper,
    _detect_format,
    _detect_language,
    _parse_duration,
)

FIXTURES_DIR = Path(__file__).parent / "fixtures"


class TestHelperFunctions:
    """ヘルパー関数のテスト"""

    def test_detect_format_2d(self):
        assert _detect_format("2D") == ScreeningFormat.STANDARD_2D

    def test_detect_format_imax(self):
        assert _detect_format("IMAXレーザー") == ScreeningFormat.IMAX

    def test_detect_format_screenx(self):
        assert _detect_format("SCREENX\nSAION") == ScreeningFormat.SCREENX

    def test_detect_format_4dx(self):
        assert _detect_format("4DX") == ScreeningFormat.FOUR_DX

    def test_detect_format_dolby(self):
        assert _detect_format("Dolby Atmos") == ScreeningFormat.DOLBY_ATMOS

    def test_detect_language_japanese(self):
        assert _detect_language("テスト映画") == "日本語"

    def test_detect_language_subtitle(self):
        assert _detect_language("テスト映画[字幕]") == "字幕"

    def test_detect_language_dubbed(self):
        assert _detect_language("テスト映画[吹替]") == "吹替"

    def test_parse_duration(self):
        assert _parse_duration("120分") == 120

    def test_parse_duration_with_text(self):
        assert _parse_duration("シアター1\n2D\n155分") == 155

    def test_parse_duration_none(self):
        assert _parse_duration("no duration") is None


class TestCinema109Scraper:
    """109シネマズ スクレイパーのテスト"""

    def test_build_schedule_url(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="109シネマズ川崎",
            area="川崎",
            prefecture="神奈川県",
        )
        scraper = Cinema109Scraper(theaters=[theater])
        url = scraper._build_schedule_url(theater, date(2026, 3, 7))
        assert url == "https://109cinemas.net/kawasaki/schedules/20260307.html?theater_code=I1"

    def test_build_schedule_url_futakotamagawa(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="109シネマズ二子玉川",
            area="二子玉川",
            prefecture="東京都",
        )
        scraper = Cinema109Scraper(theaters=[theater])
        url = scraper._build_schedule_url(theater, date(2026, 3, 7))
        assert url == "https://109cinemas.net/futakotamagawa/schedules/20260307.html?theater_code=I7"

    @pytest.mark.asyncio
    async def test_parse_schedule_from_fixture(self):
        """フィクスチャHTMLからスケジュールをパースするテスト"""
        html_path = FIXTURES_DIR / "schedule_sample.html"
        html_content = html_path.read_text(encoding="utf-8")

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.set_content(html_content)

            scraper = Cinema109Scraper(theaters=[])
            movies = await scraper._parse_schedule_page(page)

            await browser.close()

        # 2本の映画があるはず
        assert len(movies) == 2

        # 映画A の検証
        movie_a = movies[0]
        assert movie_a.title == "テスト映画A"
        assert movie_a.duration_min == 120
        assert len(movie_a.screenings) == 3

        # 09:00 - 販売終了
        s1 = movie_a.screenings[0]
        assert s1.start_time == "09:00"
        assert s1.end_time == "11:00"
        assert s1.screen == "シアター1"
        assert s1.format == ScreeningFormat.STANDARD_2D
        assert s1.availability == Availability.SOLD_OUT

        # 14:00 - 購入可能
        s2 = movie_a.screenings[1]
        assert s2.start_time == "14:00"
        assert s2.end_time == "16:00"
        assert s2.availability == Availability.AVAILABLE

        # 18:30 - IMAX
        s3 = movie_a.screenings[2]
        assert s3.start_time == "18:30"
        assert s3.screen == "シアター3"
        assert s3.format == ScreeningFormat.IMAX

        # 映画B の検証
        movie_b = movies[1]
        assert movie_b.title == "テスト映画B[字幕]"
        assert movie_b.duration_min == 95
        assert len(movie_b.screenings) == 1
        assert movie_b.screenings[0].language == "字幕"
        assert movie_b.screenings[0].format == ScreeningFormat.SCREENX
