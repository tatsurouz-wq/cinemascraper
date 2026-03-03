"""Playwright ブラウザ管理ユーティリティ"""

from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from playwright.async_api import Browser, Page, async_playwright

from src.config import SCRAPING_CONFIG


@asynccontextmanager
async def get_browser() -> AsyncGenerator[Browser, None]:
    """Playwrightブラウザのコンテキストマネージャー"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=SCRAPING_CONFIG["headless"])
        try:
            yield browser
        finally:
            await browser.close()


@asynccontextmanager
async def get_page(browser: Browser) -> AsyncGenerator[Page, None]:
    """ブラウザページのコンテキストマネージャー"""
    context = await browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        locale="ja-JP",
    )
    page = await context.new_page()
    page.set_default_timeout(SCRAPING_CONFIG["timeout_sec"] * 1000)
    try:
        yield page
    finally:
        await context.close()


async def rate_limit():
    """リクエスト間隔を保つためのスリープ"""
    await asyncio.sleep(SCRAPING_CONFIG["request_interval_sec"])
