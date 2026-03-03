import type { Area } from "./types";

/** 対応エリア一覧 */
export const AREAS: Area[] = [
  {
    id: "kawasaki",
    name: "川崎",
    prefecture: "神奈川県",
    theaters: [
      { chain: "109cinemas", area: "川崎", name: "109シネマズ川崎" },
    ],
  },
  {
    id: "futakotamagawa",
    name: "二子玉川",
    prefecture: "東京都",
    theaters: [
      { chain: "109cinemas", area: "二子玉川", name: "109シネマズ二子玉川" },
    ],
  },
  {
    id: "kohoku",
    name: "港北",
    prefecture: "神奈川県",
    theaters: [
      { chain: "109cinemas", area: "港北", name: "109シネマズ港北" },
    ],
  },
];

/** デフォルトエリアプリセット */
export const DEFAULT_PRESET = {
  left: "kawasaki",
  right: "futakotamagawa",
};

/** データパス */
export const DATA_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH || "";

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
