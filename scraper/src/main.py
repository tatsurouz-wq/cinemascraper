"""CineSync メインエントリーポイント"""

from __future__ import annotations

import asyncio
import sys
from datetime import date, timedelta

from rich.console import Console

from src.config import THEATERS_109
from src.scrapers.cinema109 import Cinema109Scraper

console = Console()


async def main(days: int = 3):
    """メインスクレイピング処理"""
    today = date.today()
    target_dates = [today + timedelta(days=i) for i in range(days)]

    console.print(f"[bold blue]🎬 CineSync スクレイパー起動[/]")
    console.print(f"対象日: {target_dates[0]} ~ {target_dates[-1]}")
    console.print(f"対象劇場: {len(THEATERS_109)}館")
    console.print()

    scraper = Cinema109Scraper(theaters=THEATERS_109)
    schedules = await scraper.scrape_all(target_dates)

    console.print()
    console.print(f"[bold green]✅ 取得完了: {len(schedules)}件のスケジュール[/]")

    # JSON出力
    scraper.save_schedules(schedules)

    total_movies = sum(len(s.movies) for s in schedules)
    total_screenings = sum(
        sum(len(m.screenings) for m in s.movies) for s in schedules
    )
    console.print(f"[bold]📊 統計: {total_movies}本の映画, {total_screenings}回の上映[/]")


if __name__ == "__main__":
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    asyncio.run(main(days))
