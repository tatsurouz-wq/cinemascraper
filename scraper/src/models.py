"""CineSync データモデル定義"""

from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class Chain(StrEnum):
    """映画館チェーン"""
    CINEMA109 = "109cinemas"
    TOHO = "toho"
    AEON = "aeon"


class ScreeningFormat(StrEnum):
    """上映フォーマット"""
    STANDARD_2D = "2D"
    IMAX = "IMAX"
    DOLBY_ATMOS = "Dolby Atmos"
    FOUR_DX = "4DX"
    SCREENX = "ScreenX"
    MX4D = "MX4D"


class Availability(StrEnum):
    """空席状況"""
    AVAILABLE = "available"
    FEW_LEFT = "few_left"
    SOLD_OUT = "sold_out"
    UNKNOWN = "unknown"


class Theater(BaseModel):
    """劇場情報"""
    chain: Chain
    name: str = Field(description="劇場名（例: 109シネマズ川崎）")
    area: str = Field(description="エリア名（例: 川崎）")
    prefecture: str = Field(description="都道府県（例: 神奈川県）")
    url: str | None = Field(default=None, description="劇場のスケジュールページURL")


class Screening(BaseModel):
    """個別上映回"""
    start_time: str = Field(description="開始時刻（HH:MM）")
    end_time: str = Field(description="終了予定時刻（HH:MM）")
    screen: str = Field(default="", description="スクリーン名")
    format: ScreeningFormat = Field(default=ScreeningFormat.STANDARD_2D)
    language: str = Field(default="日本語", description="言語（日本語/字幕等）")
    availability: Availability = Field(default=Availability.UNKNOWN)


class Movie(BaseModel):
    """映画情報"""
    title: str = Field(description="映画タイトル")
    duration_min: int | None = Field(default=None, description="上映時間（分）")
    screenings: list[Screening] = Field(default_factory=list)


class Schedule(BaseModel):
    """1劇場・1日分のスケジュール"""
    theater: Theater
    date: date
    movies: list[Movie] = Field(default_factory=list)
    scraped_at: datetime = Field(default_factory=datetime.now)


class MetaInfo(BaseModel):
    """メタ情報（全劇場分のサマリー）"""
    last_updated: datetime = Field(default_factory=datetime.now)
    theaters: list[Theater] = Field(default_factory=list)
    dates_available: list[date] = Field(default_factory=list)
