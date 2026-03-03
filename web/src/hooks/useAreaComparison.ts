"use client";

import { useMemo } from "react";
import type { Movie, Schedule } from "@/lib/types";

interface ComparisonResult {
  /** 両方のエリアで上映中の映画タイトル */
  commonMovies: string[];
  /** 左エリアのみの映画 */
  leftOnly: string[];
  /** 右エリアのみの映画 */
  rightOnly: string[];
}

/** 正規化された映画タイトル（比較用） */
function normalizeTitle(title: string): string {
  return title
    .replace(/\[.*?\]/g, "")
    .replace(/…/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** 2つのスケジュールを比較 */
export function useAreaComparison(
  leftSchedule: Schedule | null,
  rightSchedule: Schedule | null
): ComparisonResult {
  return useMemo(() => {
    if (!leftSchedule || !rightSchedule) {
      return { commonMovies: [], leftOnly: [], rightOnly: [] };
    }

    const leftTitles = new Set(
      leftSchedule.movies.map((m) => normalizeTitle(m.title))
    );
    const rightTitles = new Set(
      rightSchedule.movies.map((m) => normalizeTitle(m.title))
    );

    const commonMovies = [...leftTitles].filter((t) => rightTitles.has(t));
    const leftOnly = [...leftTitles].filter((t) => !rightTitles.has(t));
    const rightOnly = [...rightTitles].filter((t) => !leftTitles.has(t));

    return { commonMovies, leftOnly, rightOnly };
  }, [leftSchedule, rightSchedule]);
}

/** 映画リストを時間順にソート */
export function sortMoviesByTime(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => {
    const aTime = a.screenings[0]?.start_time || "99:99";
    const bTime = b.screenings[0]?.start_time || "99:99";
    return aTime.localeCompare(bTime);
  });
}
