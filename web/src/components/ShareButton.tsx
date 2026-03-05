"use client";

import type { Movie, Screening, Chain } from "@/lib/types";
import { formatShareText, shareSchedule, buildLineShareUrl } from "@/lib/share";
import { DiscountInfo } from "./DiscountInfo";

interface ShareButtonProps {
  movie: Movie;
  screening: Screening;
  theaterName: string;
  date: string;
  chain?: Chain;
  onClose: () => void;
}

export function ShareButton({
  movie,
  screening,
  theaterName,
  date,
  chain,
  onClose,
}: ShareButtonProps) {
  const text = formatShareText(movie.title, theaterName, screening, date, chain);

  const handleShare = async () => {
    await shareSchedule(text);
    onClose();
  };

  const handleLineShare = () => {
    window.open(buildLineShareUrl(text), "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-sm">共有する</h3>
          <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
            {text}
          </pre>
        </div>

        {chain && (
          <div className="p-4 border-b dark:border-gray-700 overflow-y-auto">
            <DiscountInfo chain={chain} date={date} startTime={screening.start_time} />
          </div>
        )}

        <div className="p-2 space-y-1">
          <button
            onClick={handleLineShare}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors text-left"
          >
            <span className="text-xl">💬</span>
            <span className="font-medium text-sm text-green-700">LINEで送る</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <span className="text-xl">📋</span>
            <span className="font-medium text-sm">コピーして共有</span>
          </button>
        </div>

        <div className="p-2 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
