"use client";

import { useCallback, useMemo, useState } from "react";
import type { Movie, Schedule, Screening } from "@/lib/types";

/** 時間フィルター プリセット */
export interface TimePreset {
  label: string;
  startHour: number;
  endHour: number;
}

export const TIME_PRESETS: TimePreset[] = [
  { label: "全時間", startHour: 0, endHour: 24 },
  { label: "午前", startHour: 6, endHour: 12 },
  { label: "午後", startHour: 12, endHour: 17 },
  { label: "夕方", startHour: 17, endHour: 20 },
  { label: "レイト", startHour: 20, endHour: 24 },
];

interface UseTimeFilterResult {
  startHour: number;
  endHour: number;
  setStartHour: (h: number) => void;
  setEndHour: (h: number) => void;
  applyPreset: (preset: TimePreset) => void;
  isActive: boolean;
  filterMovies: (movies: Movie[]) => Movie[];
  filterSchedule: (schedule: Schedule | null) => Schedule | null;
}

function parseHour(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):/);
  return match ? parseInt(match[1], 10) : 0;
}

function isScreeningInRange(
  screening: Screening,
  startHour: number,
  endHour: number
): boolean {
  const hour = parseHour(screening.start_time);
  return hour >= startHour && hour < endHour;
}

/** 時間帯で上映回をフィルタリング */
export function useTimeFilter(): UseTimeFilterResult {
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(24);

  const isActive = startHour !== 0 || endHour !== 24;

  const applyPreset = useCallback((preset: TimePreset) => {
    setStartHour(preset.startHour);
    setEndHour(preset.endHour);
  }, []);

  const filterMovies = useCallback(
    (movies: Movie[]): Movie[] => {
      if (!isActive) return movies;

      return movies
        .map((movie) => ({
          ...movie,
          screenings: movie.screenings.filter((s) =>
            isScreeningInRange(s, startHour, endHour)
          ),
        }))
        .filter((movie) => movie.screenings.length > 0);
    },
    [startHour, endHour, isActive]
  );

  const filterSchedule = useCallback(
    (schedule: Schedule | null): Schedule | null => {
      if (!schedule || !isActive) return schedule;
      return {
        ...schedule,
        movies: filterMovies(schedule.movies),
      };
    },
    [filterMovies, isActive]
  );

  return {
    startHour,
    endHour,
    setStartHour,
    setEndHour,
    applyPreset,
    isActive,
    filterMovies,
    filterSchedule,
  };
}
