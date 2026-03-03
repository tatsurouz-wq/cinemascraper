import type { Area } from "./types";

/** 対応エリア一覧（関東全域 109シネマズ + TOHOシネマズ） */
export const AREAS: Area[] = [
  // 東京都
  { id: "109-premiumshinjuku", name: "プレミアム新宿", prefecture: "東京都", theaters: [{ chain: "109cinemas", area: "プレミアム新宿", name: "109シネマズプレミアム新宿" }] },
  { id: "109-kiba", name: "木場", prefecture: "東京都", theaters: [{ chain: "109cinemas", area: "木場", name: "109シネマズ木場" }] },
  { id: "109-futakotamagawa", name: "二子玉川", prefecture: "東京都", theaters: [{ chain: "109cinemas", area: "二子玉川", name: "109シネマズ二子玉川" }] },
  { id: "109-grandberrypark", name: "グランベリーパーク", prefecture: "東京都", theaters: [{ chain: "109cinemas", area: "グランベリーパーク", name: "109シネマズグランベリーパーク" }] },
  { id: "toho-hibiya", name: "日比谷", prefecture: "東京都", theaters: [{ chain: "toho", area: "日比谷", name: "TOHOシネマズ日比谷" }] },
  { id: "toho-shinjuku", name: "新宿(TOHO)", prefecture: "東京都", theaters: [{ chain: "toho", area: "新宿", name: "TOHOシネマズ新宿" }] },
  { id: "toho-ikebukuro", name: "池袋", prefecture: "東京都", theaters: [{ chain: "toho", area: "池袋", name: "TOHOシネマズ池袋" }] },
  { id: "toho-nihonbashi", name: "日本橋", prefecture: "東京都", theaters: [{ chain: "toho", area: "日本橋", name: "TOHOシネマズ日本橋" }] },
  { id: "toho-ueno", name: "上野", prefecture: "東京都", theaters: [{ chain: "toho", area: "上野", name: "TOHOシネマズ上野" }] },
  { id: "toho-roppongi", name: "六本木", prefecture: "東京都", theaters: [{ chain: "toho", area: "六本木", name: "TOHOシネマズ六本木ヒルズ" }] },
  { id: "toho-shibuya", name: "渋谷", prefecture: "東京都", theaters: [{ chain: "toho", area: "渋谷", name: "TOHOシネマズ渋谷" }] },
  { id: "toho-nishiarai", name: "西新井", prefecture: "東京都", theaters: [{ chain: "toho", area: "西新井", name: "TOHOシネマズ西新井" }] },
  { id: "toho-minamiosawa", name: "南大沢", prefecture: "東京都", theaters: [{ chain: "toho", area: "南大沢", name: "TOHOシネマズ南大沢" }] },
  { id: "toho-fuchu", name: "府中", prefecture: "東京都", theaters: [{ chain: "toho", area: "府中", name: "TOHOシネマズ府中" }] },
  { id: "toho-tachikawa", name: "立川", prefecture: "東京都", theaters: [{ chain: "toho", area: "立川", name: "TOHOシネマズ立川立飛" }] },
  { id: "toho-kinshicho", name: "錦糸町", prefecture: "東京都", theaters: [{ chain: "toho", area: "錦糸町", name: "TOHOシネマズ錦糸町" }] },
  // 神奈川県
  { id: "109-kawasaki", name: "川崎(109)", prefecture: "神奈川県", theaters: [{ chain: "109cinemas", area: "川崎", name: "109シネマズ川崎" }] },
  { id: "109-kohoku", name: "港北", prefecture: "神奈川県", theaters: [{ chain: "109cinemas", area: "港北", name: "109シネマズ港北" }] },
  { id: "109-shonan", name: "湘南", prefecture: "神奈川県", theaters: [{ chain: "109cinemas", area: "湘南", name: "109シネマズ湘南" }] },
  { id: "109-movil", name: "ムービル", prefecture: "神奈川県", theaters: [{ chain: "109cinemas", area: "ムービル", name: "109シネマズムービル" }] },
  { id: "109-yumegaoka", name: "ゆめが丘", prefecture: "神奈川県", theaters: [{ chain: "109cinemas", area: "ゆめが丘", name: "109シネマズゆめが丘" }] },
  { id: "toho-kawasaki", name: "川崎(TOHO)", prefecture: "神奈川県", theaters: [{ chain: "toho", area: "TOHO川崎", name: "TOHOシネマズ川崎" }] },
  { id: "toho-ebina", name: "海老名", prefecture: "神奈川県", theaters: [{ chain: "toho", area: "海老名", name: "TOHOシネマズ海老名" }] },
  { id: "toho-odawara", name: "小田原", prefecture: "神奈川県", theaters: [{ chain: "toho", area: "小田原", name: "TOHOシネマズ小田原" }] },
  { id: "toho-yokohama", name: "横浜", prefecture: "神奈川県", theaters: [{ chain: "toho", area: "横浜", name: "TOHOシネマズららぽーと横浜" }] },
  { id: "toho-kamiooka", name: "上大岡", prefecture: "神奈川県", theaters: [{ chain: "toho", area: "上大岡", name: "TOHOシネマズ上大岡" }] },
  // 千葉県
  { id: "toho-funabashi", name: "船橋", prefecture: "千葉県", theaters: [{ chain: "toho", area: "船橋", name: "TOHOシネマズららぽーと船橋" }] },
  { id: "toho-ichikawa", name: "市川", prefecture: "千葉県", theaters: [{ chain: "toho", area: "市川", name: "TOHOシネマズ市川コルトンプラザ" }] },
  { id: "toho-kashiwa", name: "柏", prefecture: "千葉県", theaters: [{ chain: "toho", area: "柏", name: "TOHOシネマズ柏" }] },
  { id: "toho-yachiyo", name: "八千代", prefecture: "千葉県", theaters: [{ chain: "toho", area: "八千代", name: "TOHOシネマズ八千代緑が丘" }] },
  { id: "toho-nagareyama", name: "流山", prefecture: "千葉県", theaters: [{ chain: "toho", area: "流山", name: "TOHOシネマズ流山おおたかの森" }] },
  { id: "toho-ichihara", name: "市原", prefecture: "千葉県", theaters: [{ chain: "toho", area: "市原", name: "TOHOシネマズ市原" }] },
  // 埼玉県
  { id: "109-shobu", name: "菖蒲", prefecture: "埼玉県", theaters: [{ chain: "109cinemas", area: "菖蒲", name: "109シネマズ菖蒲" }] },
  { id: "toho-fujimi", name: "富士見", prefecture: "埼玉県", theaters: [{ chain: "toho", area: "富士見", name: "TOHOシネマズららぽーと富士見" }] },
  // 栃木県
  { id: "109-sano", name: "佐野", prefecture: "栃木県", theaters: [{ chain: "109cinemas", area: "佐野", name: "109シネマズ佐野" }] },
  { id: "toho-utsunomiya", name: "宇都宮", prefecture: "栃木県", theaters: [{ chain: "toho", area: "宇都宮", name: "TOHOシネマズ宇都宮" }] },
  // 茨城県
  { id: "toho-hitachinaka", name: "ひたちなか", prefecture: "茨城県", theaters: [{ chain: "toho", area: "ひたちなか", name: "TOHOシネマズひたちなか" }] },
  { id: "toho-mito", name: "水戸", prefecture: "茨城県", theaters: [{ chain: "toho", area: "水戸", name: "TOHOシネマズ水戸内原" }] },
];

/** 都県グループ */
export const PREFECTURES = ["東京都", "神奈川県", "千葉県", "埼玉県", "栃木県", "茨城県"] as const;

/** エリアを都県でグループ化 */
export function getAreasByPrefecture(): Record<string, Area[]> {
  const grouped: Record<string, Area[]> = {};
  for (const pref of PREFECTURES) {
    grouped[pref] = AREAS.filter((a) => a.prefecture === pref);
  }
  return grouped;
}

/** デフォルトで選択する5エリア */
export const DEFAULT_SELECTED_AREAS = [
  "toho-shinjuku",
  "109-kawasaki",
  "toho-funabashi",
  "toho-ikebukuro",
  "toho-yokohama",
];

/** 最大同時比較数 */
export const MAX_COMPARE_AREAS = 5;

/** データパス */
export const DATA_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH || "/cinemascraper";

/** 空席状況ラベル */
export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "◎ 購入可",
  few_left: "△ 残りわずか",
  sold_out: "✕ 販売終了",
  unknown: "- 不明",
};

/** 空席状況カラー */
export const AVAILABILITY_COLORS: Record<string, string> = {
  available: "text-green-600",
  few_left: "text-yellow-500",
  sold_out: "text-gray-400",
  unknown: "text-gray-300",
};

/** フォーマットラベル */
export const FORMAT_BADGES: Record<string, string> = {
  "2D": "bg-gray-100 text-gray-700",
  IMAX: "bg-blue-100 text-blue-800",
  "Dolby Atmos": "bg-purple-100 text-purple-800",
  "4DX": "bg-orange-100 text-orange-800",
  ScreenX: "bg-teal-100 text-teal-800",
  MX4D: "bg-red-100 text-red-800",
};
