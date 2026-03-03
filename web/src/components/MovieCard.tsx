"use client";

import type { Movie, Screening } from "@/lib/types";
import {
  AVAILABILITY_COLORS,
  AVAILABILITY_LABELS,
  FORMAT_BADGES,
} from "@/lib/constants";

interface MovieCardProps {
  movie: Movie;
  theaterName: string;
  date: string;
  onScreeningSelect?: (movie: Movie, screening: Screening) => void;
  highlightTitle?: boolean;
}

export function MovieCard({
  movie,
  theaterName,
  date,
  onScreeningSelect,
  highlightTitle = false,
}: MovieCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 mb-2 transition-colors
        ${highlightTitle ? "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20" : "border-gray-200 dark:border-gray-700"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-sm leading-tight">{movie.title}</h3>
        {movie.duration_min && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {movie.duration_min}分
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {movie.screenings.map((s, i) => (
          <button
            key={i}
            onClick={() => onScreeningSelect?.(movie, s)}
            disabled={s.availability === "sold_out"}
            className={`flex flex-col items-center px-2.5 py-1.5 rounded-md border text-xs transition-all
              ${
                s.availability === "sold_out"
                  ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed dark:bg-gray-900"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer dark:border-gray-600"
              }`}
          >
            <div className="font-mono font-medium">
              {s.start_time}
              <span className="text-gray-400">〜</span>
              {s.end_time}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {s.format !== "2D" && (
                <span
                  className={`px-1 py-0.5 rounded text-[10px] font-medium ${FORMAT_BADGES[s.format] || ""}`}
                >
                  {s.format}
                </span>
              )}
              <span className={`text-[10px] ${AVAILABILITY_COLORS[s.availability]}`}>
                {AVAILABILITY_LABELS[s.availability]}
              </span>
            </div>
            {s.screen && (
              <div className="text-[10px] text-gray-400 mt-0.5">{s.screen}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
