"use client";

import type { Chain } from "@/lib/types";
import { getApplicableDiscounts, getDayName, type Discount } from "@/lib/discounts";

interface DiscountInfoProps {
  chain: Chain;
  date: string;
  startTime?: string;
}

function DiscountBadge({ discount, highlight }: { discount: Discount; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
        highlight
          ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800"
          : "bg-gray-50 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700"
      }`}
    >
      <span className="text-base">{discount.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-xs">{discount.name}</div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400">{discount.condition}</div>
      </div>
      <div className="text-xs font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
        {discount.price}
      </div>
    </div>
  );
}

export function DiscountInfo({ chain, date, startTime }: DiscountInfoProps) {
  const { today, cardDiscounts } = getApplicableDiscounts(chain, date, startTime);
  const dayName = getDayName(date);

  if (today.length === 0 && cardDiscounts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {today.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
            💰 {date}（{dayName}）の割引
          </h4>
          <div className="space-y-1.5">
            {today.map((d, i) => (
              <DiscountBadge key={i} discount={d} highlight />
            ))}
          </div>
        </div>
      )}

      {cardDiscounts.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
            💳 カード割引
          </h4>
          <div className="space-y-1.5">
            {cardDiscounts.map((d, i) => (
              <DiscountBadge key={i} discount={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
