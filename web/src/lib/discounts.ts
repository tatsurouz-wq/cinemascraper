import type { Chain } from "./types";

/** 割引の種類 */
export type DiscountType = "service_day" | "credit_card" | "late_show" | "member";

/** 割引情報 */
export interface Discount {
  name: string;
  type: DiscountType;
  chain: Chain | "all";
  price: string;
  condition: string;
  /** 0=日, 1=月, ..., 6=土。nullなら曜日不問 */
  dayOfWeek: number | null;
  /** 毎月の日（1日など）。nullなら日付不問 */
  dayOfMonth: number | null;
  /** レイトショーなど時間条件（24h）。nullなら時間不問 */
  afterHour: number | null;
  icon: string;
}

/** TOHOシネマズの割引 */
const TOHO_DISCOUNTS: Discount[] = [
  { name: "ファーストデー", type: "service_day", chain: "toho", price: "1,300円", condition: "誰でも（12/1は1,000円）", dayOfWeek: null, dayOfMonth: 1, afterHour: null, icon: "🎬" },
  { name: "auマンデイ", type: "member", chain: "toho", price: "1,100円", condition: "Pontaパス/auスマートパス会員", dayOfWeek: 1, dayOfMonth: null, afterHour: null, icon: "📱" },
  { name: "TOHO-ONEメンバーデイ", type: "member", chain: "toho", price: "1,300円", condition: "TOHO-ONE会員", dayOfWeek: 2, dayOfMonth: null, afterHour: null, icon: "🎫" },
  { name: "TOHOウェンズデイ", type: "service_day", chain: "toho", price: "1,300円", condition: "誰でも", dayOfWeek: 3, dayOfMonth: null, afterHour: null, icon: "🎬" },
  { name: "セゾンの木曜日", type: "credit_card", chain: "toho", price: "1,200円", condition: "セゾン・UCカード会員", dayOfWeek: 4, dayOfMonth: null, afterHour: null, icon: "💳" },
  { name: "FODフライデイ", type: "member", chain: "toho", price: "1,200円", condition: "FODプレミアム会員", dayOfWeek: 5, dayOfMonth: null, afterHour: null, icon: "📺" },
  { name: "JERAサンデイ", type: "service_day", chain: "toho", price: "1,700円（300円引き）", condition: "要クーポン取得", dayOfWeek: 0, dayOfMonth: null, afterHour: null, icon: "☀️" },
  { name: "レイトショー", type: "late_show", chain: "toho", price: "1,500円", condition: "20時以降の上映回", dayOfWeek: null, dayOfMonth: null, afterHour: 20, icon: "🌙" },
];

/** 109シネマズの割引 */
const CINEMA109_DISCOUNTS: Discount[] = [
  { name: "ファーストデイ", type: "service_day", chain: "109cinemas", price: "1,200円", condition: "誰でも", dayOfWeek: null, dayOfMonth: 1, afterHour: null, icon: "🎬" },
  { name: "ペアマンデイ", type: "service_day", chain: "109cinemas", price: "2名3,000円", condition: "2名同時鑑賞", dayOfWeek: 1, dayOfMonth: null, afterHour: null, icon: "👫" },
  { name: "メンバーズデイ", type: "member", chain: "109cinemas", price: "1,200円", condition: "シネマポイント会員", dayOfWeek: 2, dayOfMonth: null, afterHour: null, icon: "🎫" },
  { name: "109シネマズデイ", type: "service_day", chain: "109cinemas", price: "1,200円", condition: "誰でも", dayOfWeek: 3, dayOfMonth: null, afterHour: null, icon: "🎬" },
  { name: "レイトショー", type: "late_show", chain: "109cinemas", price: "1,500円", condition: "20時以降の上映回", dayOfWeek: null, dayOfMonth: null, afterHour: 20, icon: "🌙" },
];

/** T-Joyの割引 */
const TJOY_DISCOUNTS: Discount[] = [
  { name: "ファーストデー", type: "service_day", chain: "tjoy", price: "1,200円", condition: "誰でも", dayOfWeek: null, dayOfMonth: 1, afterHour: null, icon: "🎬" },
  { name: "レディースデー", type: "service_day", chain: "tjoy", price: "1,200円", condition: "女性", dayOfWeek: 3, dayOfMonth: null, afterHour: null, icon: "👩" },
  { name: "レイトショー", type: "late_show", chain: "tjoy", price: "1,400円", condition: "20時以降の上映回", dayOfWeek: null, dayOfMonth: null, afterHour: 20, icon: "🌙" },
];

/** HUMAXの割引 */
const HUMAX_DISCOUNTS: Discount[] = [
  { name: "ファーストデー", type: "service_day", chain: "humax", price: "1,200円", condition: "誰でも", dayOfWeek: null, dayOfMonth: 1, afterHour: null, icon: "🎬" },
  { name: "レディースデー", type: "service_day", chain: "humax", price: "1,200円", condition: "女性", dayOfWeek: 3, dayOfMonth: null, afterHour: null, icon: "👩" },
  { name: "レイトショー", type: "late_show", chain: "humax", price: "1,300円", condition: "20時以降の上映回", dayOfWeek: null, dayOfMonth: null, afterHour: 20, icon: "🌙" },
];

/** クレジットカード割引（チェーン横断） */
const CREDIT_CARD_DISCOUNTS: Discount[] = [
  { name: "セゾン・UCカード", type: "credit_card", chain: "toho", price: "木曜1,200円", condition: "セゾン・UCカード会員", dayOfWeek: 4, dayOfMonth: null, afterHour: null, icon: "💳" },
  { name: "シネマイレージカードセゾン", type: "credit_card", chain: "toho", price: "6本で1本無料", condition: "カード会員", dayOfWeek: null, dayOfMonth: null, afterHour: null, icon: "💳" },
  { name: "エポスカード", type: "credit_card", chain: "toho", price: "1,400円", condition: "エポトクプラザ経由購入", dayOfWeek: null, dayOfMonth: null, afterHour: null, icon: "💳" },
  { name: "JCBカード S", type: "credit_card", chain: "toho", price: "300〜500円引き", condition: "JCBカード S会員", dayOfWeek: null, dayOfMonth: null, afterHour: null, icon: "💳" },
];

/** 全割引データ */
const ALL_DISCOUNTS: Discount[] = [
  ...TOHO_DISCOUNTS,
  ...CINEMA109_DISCOUNTS,
  ...TJOY_DISCOUNTS,
  ...HUMAX_DISCOUNTS,
  ...CREDIT_CARD_DISCOUNTS,
];

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** 曜日名を取得 */
export function getDayName(date: string): string {
  const d = new Date(date + "T00:00:00");
  return DAY_NAMES[d.getDay()];
}

/** 指定日・チェーン・上映時間に該当する割引を取得 */
export function getApplicableDiscounts(
  chain: Chain,
  date: string,
  startTime?: string
): { today: Discount[]; cardDiscounts: Discount[] } {
  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.getDay();
  const dayOfMonth = d.getDate();
  const hour = startTime ? parseInt(startTime.split(":")[0], 10) : null;

  const chainDiscounts = ALL_DISCOUNTS.filter(
    (disc) => disc.chain === chain && disc.type !== "credit_card"
  );

  const today = chainDiscounts.filter((disc) => {
    if (disc.dayOfMonth !== null && disc.dayOfMonth !== dayOfMonth) return false;
    if (disc.dayOfWeek !== null && disc.dayOfWeek !== dayOfWeek) return false;
    if (disc.afterHour !== null && (hour === null || hour < disc.afterHour)) return false;
    return true;
  });

  const cardDiscounts = ALL_DISCOUNTS.filter((disc) => {
    if (disc.type !== "credit_card") return false;
    if (disc.chain !== chain && disc.chain !== "all") return false;
    // 曜日限定のカード割引はその曜日のみ表示
    if (disc.dayOfWeek !== null && disc.dayOfWeek !== dayOfWeek) return false;
    return true;
  });

  return { today, cardDiscounts };
}

/** 割引情報をテキスト化 */
export function formatDiscountText(
  chain: Chain,
  date: string,
  startTime?: string
): string {
  const { today, cardDiscounts } = getApplicableDiscounts(chain, date, startTime);
  const dayName = getDayName(date);
  const lines: string[] = [];

  if (today.length > 0) {
    lines.push(`💰 ${date}(${dayName})の割引:`);
    for (const d of today) {
      lines.push(`  ${d.icon} ${d.name} ${d.price}（${d.condition}）`);
    }
  }

  if (cardDiscounts.length > 0) {
    lines.push(`💳 カード割引:`);
    for (const d of cardDiscounts) {
      lines.push(`  ${d.icon} ${d.name}: ${d.price}（${d.condition}）`);
    }
  }

  return lines.join("\n");
}
