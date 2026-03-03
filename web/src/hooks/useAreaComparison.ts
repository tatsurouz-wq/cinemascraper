"use client";

import { useMemo } from "react";
import type { Movie, Schedule } from "@/lib/types";

interface ComparisonResult {
  /** 全エリアで共通の映画タイトル */
  commonMovies: string[];
  /** エリアごとの固有映画 */
  uniqueByArea: Map<number, string[]>;
  /** 各エリアの映画タイトルSet */
  titleSets: Set<string>[];
}

/** 正規化された映画タイトル（比較用） */
function normalizeTitle(title: string): string {
  return title
    .replace(/\[.*?\]/g, "")
    .replace(/…/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** N個のスケジュールを比較 */
export function useAreaComparison(
  schedules: (Schedule | null)[]
): ComparisonResult {
  return useMemo(() => {
    const validSchedules = schedules.filter(
      (s): s is Schedule => s !== null && s.movies.length > 0
    );

    if (validSchedules.length === 0) {
      return { commonMovies: [], uniqueByArea: new Map(), titleSets: [] };
    }

    const titleSets = schedules.map(
      (s) =>
        new Set(s ? s.movies.map((m) => normalizeTitle(m.title)) : [])
    );

    // 全エリア共通
    const allTitles = titleSets.filter((s) => s.size > 0);
    let commonMovies: string[] = [];
    if (allTitles.length > 0) {
      commonMovies = [...allTitles[0]].filter((title) =>
        allTitles.every((set) => set.has(title))
      );
    }

    // 各エリア固有
    const uniqueByArea = new Map<number, string[]>();
    titleSets.forEach((set, idx) => {
      const unique = [...set].filter((title) =>
        titleSets.every((otherSet, otherIdx) =>
          otherIdx === idx ? true : !otherSet.has(title)
        )
      );
      if (unique.length > 0) {
        uniqueByArea.set(idx, unique);
      }
    });

    return { commonMovies, uniqueByArea, titleSets };
  }, [schedules]);
}

/** 映画リストを時間順にソート */
export function sortMoviesByTime(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => {
    const aTime = a.screenings[0]?.start_time || "99:99";
    const bTime = b.screenings[0]?.start_time || "99:99";
    return aTime.localeCompare(bTime);
  });
}
