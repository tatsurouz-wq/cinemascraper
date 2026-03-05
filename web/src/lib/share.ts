import type { Chain, Screening } from "./types";
import { formatDiscountText } from "./discounts";

/** LINE共有用テキストを生成 */
export function formatShareText(
  movieTitle: string,
  theaterName: string,
  screening: Screening,
  date: string,
  chain?: Chain
): string {
  const lines = [
    `🎬 ${movieTitle}`,
    `📍 ${theaterName}`,
    `📅 ${date}`,
    `⏰ ${screening.start_time}〜${screening.end_time}`,
  ];

  if (screening.format !== "2D") {
    lines.push(`🎥 ${screening.format}`);
  }

  if (chain) {
    const discountText = formatDiscountText(chain, date, screening.start_time);
    if (discountText) {
      lines.push("", discountText);
    }
  }

  lines.push("", "CineSyncで検索 🔍");
  return lines.join("\n");
}

/** Web Share APIまたはクリップボードで共有 */
export async function shareSchedule(text: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // ユーザーがキャンセル
    }
  }

  // フォールバック: クリップボードにコピー
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** LINE共有URLを生成 */
export function buildLineShareUrl(text: string): string {
  return `https://line.me/R/share?text=${encodeURIComponent(text)}`;
}
