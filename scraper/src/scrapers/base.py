"""基底スクレイパークラス"""

from __future__ import annotations

import asyncio
import json
from abc import ABC, abstractmethod
from datetime import date
from pathlib import Path

from rich.console import Console

from src.config import OUTPUT_DIR, SCRAPING_CONFIG
from src.models import Schedule, Theater
from src.utils.browser import get_browser, get_page, rate_limit

console = Console()


class BaseScraper(ABC):
    """映画館スクレイパーの基底クラス"""

    def __init__(self, theaters: list[Theater]):
        self.theaters = theaters
        self.max_retries = SCRAPING_CONFIG["max_retries"]

    @abstractmethod
    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        """1劇場・1日分のスケジュールを取得する（サブクラスで実装）"""
        ...

    async def scrape_all(self, target_dates: list[date]) -> list[Schedule]:
        """全劇場・指定日のスケジュールを一括取得"""
        schedules: list[Schedule] = []

        async with get_browser() as browser:
            for theater in self.theaters:
                for target_date in target_dates:
                    schedule = await self._scrape_with_retry(theater, target_date)
                    if schedule:
                        schedules.append(schedule)
                    await rate_limit()

        return schedules

    async def _scrape_with_retry(
        self, theater: Theater, target_date: date
    ) -> Schedule | None:
        """リトライ付きスクレイピング"""
        for attempt in range(1, self.max_retries + 1):
            try:
                console.print(
                    f"[blue]📡 取得中: {theater.name} ({target_date})[/] "
                    f"試行 {attempt}/{self.max_retries}"
                )
                schedule = await self.scrape_theater(theater, target_date)
                console.print(
                    f"[green]✅ 成功: {theater.name} - "
                    f"{len(schedule.movies)}本の映画[/]"
                )
                return schedule
            except Exception as e:
                console.print(
                    f"[red]❌ エラー: {theater.name} (試行 {attempt}): {e}[/]"
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(2 ** attempt)
        return None

    def save_schedules(self, schedules: list[Schedule], base_dir: str | None = None):
        """スケジュールをJSONファイルとして保存"""
        output_base = Path(base_dir or OUTPUT_DIR)

        for schedule in schedules:
            chain_dir = output_base / schedule.theater.chain.value
            chain_dir.mkdir(parents=True, exist_ok=True)

            area_slug = schedule.theater.area.lower().replace(" ", "_")
            filename = f"{area_slug}_{schedule.date.isoformat()}.json"
            filepath = chain_dir / filename

            data = json.loads(schedule.model_dump_json())
            filepath.write_text(
                json.dumps(data, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            console.print(f"[green]💾 保存: {filepath}[/]")
