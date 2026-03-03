"""CineSync 劇場定義・設定"""

from pathlib import Path

from src.models import Chain, Theater

# 109シネマズ 関東エリア全劇場
THEATERS_109: list[Theater] = [
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズプレミアム新宿",
        area="プレミアム新宿",
        prefecture="東京都",
        url="https://109cinemas.net/premiumshinjuku/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ木場",
        area="木場",
        prefecture="東京都",
        url="https://109cinemas.net/kiba/",
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
        name="109シネマズグランベリーパーク",
        area="グランベリーパーク",
        prefecture="東京都",
        url="https://109cinemas.net/grandberrypark/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ川崎",
        area="川崎",
        prefecture="神奈川県",
        url="https://109cinemas.net/kawasaki/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ港北",
        area="港北",
        prefecture="神奈川県",
        url="https://109cinemas.net/kohoku/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ湘南",
        area="湘南",
        prefecture="神奈川県",
        url="https://109cinemas.net/shonan/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズムービル",
        area="ムービル",
        prefecture="神奈川県",
        url="https://109cinemas.net/movil/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズゆめが丘",
        area="ゆめが丘",
        prefecture="神奈川県",
        url="https://109cinemas.net/yumegaoka/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ佐野",
        area="佐野",
        prefecture="栃木県",
        url="https://109cinemas.net/sano/",
    ),
    Theater(
        chain=Chain.CINEMA109,
        name="109シネマズ菖蒲",
        area="菖蒲",
        prefecture="埼玉県",
        url="https://109cinemas.net/shobu/",
    ),
]

# TOHOシネマズ 関東エリア全劇場
THEATERS_TOHO: list[Theater] = [
    # 東京都
    Theater(chain=Chain.TOHO, name="TOHOシネマズ日比谷", area="日比谷", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/081/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ新宿", area="新宿", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/076/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ池袋", area="池袋", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/084/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ日本橋", area="日本橋", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/073/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ上野", area="上野", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/080/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ六本木ヒルズ", area="六本木", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/009/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ渋谷", area="渋谷", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/043/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ西新井", area="西新井", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/040/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ南大沢", area="南大沢", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/006/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ府中", area="府中", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/012/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ立川立飛", area="立川", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/085/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ錦糸町", area="錦糸町", prefecture="東京都",
            url="https://www.tohotheater.jp/net/schedule/029/TNPI2000J01.do"),
    # 千葉県
    Theater(chain=Chain.TOHO, name="TOHOシネマズららぽーと船橋", area="船橋", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/018/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ市川コルトンプラザ", area="市川", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/003/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ柏", area="柏", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/077/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ八千代緑が丘", area="八千代", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/028/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ流山おおたかの森", area="流山", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/035/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ市原", area="市原", prefecture="千葉県",
            url="https://www.tohotheater.jp/net/schedule/071/TNPI2000J01.do"),
    # 神奈川県
    Theater(chain=Chain.TOHO, name="TOHOシネマズ海老名", area="海老名", prefecture="神奈川県",
            url="https://www.tohotheater.jp/net/schedule/007/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ小田原", area="小田原", prefecture="神奈川県",
            url="https://www.tohotheater.jp/net/schedule/008/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ川崎", area="TOHO川崎", prefecture="神奈川県",
            url="https://www.tohotheater.jp/net/schedule/010/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズららぽーと横浜", area="横浜", prefecture="神奈川県",
            url="https://www.tohotheater.jp/net/schedule/036/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ上大岡", area="上大岡", prefecture="神奈川県",
            url="https://www.tohotheater.jp/net/schedule/066/TNPI2000J01.do"),
    # 埼玉県
    Theater(chain=Chain.TOHO, name="TOHOシネマズららぽーと富士見", area="富士見", prefecture="埼玉県",
            url="https://www.tohotheater.jp/net/schedule/075/TNPI2000J01.do"),
    # 栃木県
    Theater(chain=Chain.TOHO, name="TOHOシネマズ宇都宮", area="宇都宮", prefecture="栃木県",
            url="https://www.tohotheater.jp/net/schedule/015/TNPI2000J01.do"),
    # 茨城県
    Theater(chain=Chain.TOHO, name="TOHOシネマズひたちなか", area="ひたちなか", prefecture="茨城県",
            url="https://www.tohotheater.jp/net/schedule/024/TNPI2000J01.do"),
    Theater(chain=Chain.TOHO, name="TOHOシネマズ水戸内原", area="水戸", prefecture="茨城県",
            url="https://www.tohotheater.jp/net/schedule/025/TNPI2000J01.do"),
]

# 全劇場リスト
ALL_THEATERS: list[Theater] = THEATERS_109 + THEATERS_TOHO

# TOHO劇場コード（URLから抽出）
TOHO_THEATER_CODES: dict[str, str] = {
    t.area: t.url.split("/schedule/")[1].split("/")[0]
    for t in THEATERS_TOHO
    if t.url
}

# スクレイピング設定
SCRAPING_CONFIG = {
    "request_interval_sec": 2.0,
    "max_retries": 3,
    "timeout_sec": 30,
    "headless": True,
}

# 出力設定（プロジェクトルート基準）
OUTPUT_DIR = str(Path(__file__).parent.parent.parent / "data" / "schedules")
