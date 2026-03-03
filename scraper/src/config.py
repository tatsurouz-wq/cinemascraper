"""CineSync 劇場定義・設定"""

from pathlib import Path

from src.models import Chain, Theater

# 109シネマズ 対象劇場
THEATERS_109: list[Theater] = [
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ川崎",
        area="川崎",
        prefecture="神奈川県",
        url="https://109cinemas.net/kawasaki/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ二子玉川",
        area="二子玉川",
        prefecture="東京都",
        url="https://109cinemas.net/futakotamagawa/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ港北",
        area="港北",
        prefecture="神奈川県",
        url="https://109cinemas.net/kohoku/",
    ),
]

# スクレイピング設定
SCRAPING_CONFIG = {
    "request_interval_sec": 2.0,
    "max_retries": 3,
    "timeout_sec": 30,
    "headless": True,
}

# 出力設定（プロジェクトルート基準）
OUTPUT_DIR = str(Path(__file__).parent.parent.parent / "data" / "schedules")
