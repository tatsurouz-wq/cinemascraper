"""データモデルのテスト"""

from datetime import date, datetime

from src.models import (
    Availability,
    Chain,
    MetaInfo,
    Movie,
    Schedule,
    Screening,
    ScreeningFormat,
    Theater,
)


class TestTheater:
    def test_create_theater(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="109シネマズ川崎",
            area="川崎",
            prefecture="神奈川県",
        )
        assert theater.chain == Chain.CINEMA109
        assert theater.name == "109シネマズ川崎"
        assert theater.url is None

    def test_theater_with_url(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="109シネマズ川崎",
            area="川崎",
            prefecture="神奈川県",
            url="https://109cinemas.net/kawasaki/",
        )
        assert theater.url == "https://109cinemas.net/kawasaki/"


class TestScreening:
    def test_create_screening(self):
        screening = Screening(
            start_time="14:00",
            end_time="16:00",
            screen="シアター1",
            format=ScreeningFormat.STANDARD_2D,
            availability=Availability.AVAILABLE,
        )
        assert screening.start_time == "14:00"
        assert screening.end_time == "16:00"
        assert screening.format == ScreeningFormat.STANDARD_2D

    def test_screening_defaults(self):
        screening = Screening(start_time="10:00", end_time="12:00")
        assert screening.screen == ""
        assert screening.format == ScreeningFormat.STANDARD_2D
        assert screening.language == "日本語"
        assert screening.availability == Availability.UNKNOWN


class TestMovie:
    def test_create_movie(self):
        movie = Movie(title="テスト映画", duration_min=120)
        assert movie.title == "テスト映画"
        assert movie.duration_min == 120
        assert movie.screenings == []

    def test_movie_with_screenings(self):
        screenings = [
            Screening(start_time="10:00", end_time="12:00"),
            Screening(start_time="14:00", end_time="16:00"),
        ]
        movie = Movie(title="テスト映画", screenings=screenings)
        assert len(movie.screenings) == 2


class TestSchedule:
    def test_create_schedule(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="109シネマズ川崎",
            area="川崎",
            prefecture="神奈川県",
        )
        schedule = Schedule(
            theater=theater,
            date=date(2026, 3, 7),
        )
        assert schedule.theater.name == "109シネマズ川崎"
        assert schedule.date == date(2026, 3, 7)
        assert schedule.movies == []

    def test_schedule_json_serialization(self):
        theater = Theater(
            chain=Chain.CINEMA109,
            name="テスト劇場",
            area="テスト",
            prefecture="東京都",
        )
        movie = Movie(
            title="テスト映画",
            duration_min=120,
            screenings=[Screening(start_time="10:00", end_time="12:00")],
        )
        schedule = Schedule(
            theater=theater,
            date=date(2026, 3, 7),
            movies=[movie],
        )
        json_str = schedule.model_dump_json()
        assert "テスト映画" in json_str
        assert "10:00" in json_str


class TestMetaInfo:
    def test_create_meta(self):
        meta = MetaInfo()
        assert meta.theaters == []
        assert meta.dates_available == []
