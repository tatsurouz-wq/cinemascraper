"use client";

import type { Schedule, Movie, Screening } from "@/lib/types";
import { MovieCard } from "./MovieCard";
import { sortMoviesByTime } from "@/hooks/useAreaComparison";

interface TimelineProps {
  schedule: Schedule;
  commonMovies?: string[];
  onScreeningSelect?: (movie: Movie, screening: Screening) => void;
}

export function Timeline({
  schedule,
  commonMovies = [],
  onScreeningSelect,
}: TimelineProps) {
  const sortedMovies = sortMoviesByTime(schedule.movies);

  if (sortedMovies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>📭 上映スケジュールがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-base">{schedule.theater.name}</h2>
        <span className="text-xs text-gray-400">
          {sortedMovies.length}作品
        </span>
      </div>
      {sortedMovies.map((movie) => {
        const normalized = movie.title
          .replace(/\[.*?\]/g, "")
          .replace(/…/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const isCommon = commonMovies.includes(normalized);

        return (
          <MovieCard
            key={movie.title}
            movie={movie}
            theaterName={schedule.theater.name}
            date={schedule.date}
            highlightTitle={isCommon}
            onScreeningSelect={onScreeningSelect}
          />
        );
      })}
    </div>
  );
}
