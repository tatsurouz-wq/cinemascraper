"""CineSync メインエントリーポイント"""

from __future__ import annotations

import asyncio
import sys
from datetime import date, timedelta

from rich.console import Console

from src.config import THEATERS_109, THEATERS_TOHO, THEATERS_TJOY
from src.scrapers.cinema109 import Cinema109Scraper
from src.scrapers.toho import TohoScraper
from src.scrapers.tjoy import TjoyScraper

console = Console()


async def main(days: int = 3, chain: str = "all"):
    """メインスクレイピング処理"""
    today = date.today()
    target_dates = [today + timedelta(days=i) for i in range(days)]

    console.print(f"[bold blue]🎬 CineSync スクレイパー起動[/]")
    console.print(f"対象日: {target_dates[0]} ~ {target_dates[-1]}")

    all_schedules = []

    # 109シネマズ
    if chain in ("all", "109"):
        console.print(f"\n[bold cyan]📡 109シネマズ ({len(THEATERS_109)}館)[/]")
        scraper_109 = Cinema109Scraper(theaters=THEATERS_109)
        schedules_109 = await scraper_109.scrape_all(target_dates)
        scraper_109.save_schedules(schedules_109)
        all_schedules.extend(schedules_109)
        console.print(f"[green]✅ 109シネマズ完了: {len(schedules_109)}件[/]")

    # TOHOシネマズ
    if chain in ("all", "toho"):
        console.print(f"\n[bold cyan]📡 TOHOシネマズ ({len(THEATERS_TOHO)}館)[/]")
        scraper_toho = TohoScraper(theaters=THEATERS_TOHO)
        schedules_toho = await scraper_toho.scrape_all(target_dates)
        scraper_toho.save_schedules(schedules_toho)
        all_schedules.extend(schedules_toho)
        console.print(f"[green]✅ TOHOシネマズ完了: {len(schedules_toho)}件[/]")

    # T-Joy系列
    if chain in ("all", "tjoy"):
        console.print(f"\n[bold cyan]📡 T-Joy系列 ({len(THEATERS_TJOY)}館)[/]")
        scraper_tjoy = TjoyScraper(theaters=THEATERS_TJOY)
        schedules_tjoy = await scraper_tjoy.scrape_all(target_dates)
        scraper_tjoy.save_schedules(schedules_tjoy)
        all_schedules.extend(schedules_tjoy)
        console.print(f"[green]✅ T-Joy系列完了: {len(schedules_tjoy)}件[/]")

    console.print(f"\n[bold green]✅ 全取得完了: {len(all_schedules)}件のスケジュール[/]")

    total_movies = sum(len(s.movies) for s in all_schedules)
    total_screenings = sum(
        sum(len(m.screenings) for m in s.movies) for s in all_schedules
    )
    console.print(f"[bold]📊 統計: {total_movies}本の映画, {total_screenings}回の上映[/]")


if __name__ == "__main__":
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    chain = sys.argv[2] if len(sys.argv) > 2 else "all"
    asyncio.run(main(days, chain))
