"use client";

import { useEffect, useState } from "react";
import type { Schedule } from "@/lib/types";
import { DATA_BASE_PATH, AREAS } from "@/lib/constants";

interface MultiScheduleEntry {
  areaId: string;
  schedule: Schedule | null;
  loading: boolean;
  error: string | null;
}

interface UseMultiScheduleResult {
  entries: MultiScheduleEntry[];
  allLoading: boolean;
  anyError: boolean;
}

/** 複数エリアのスケジュールを並列取得 */
export function useMultiSchedule(
  areaIds: string[],
  date: string
): UseMultiScheduleResult {
  const [entries, setEntries] = useState<MultiScheduleEntry[]>([]);

  useEffect(() => {
    if (!date || areaIds.length === 0) {
      setEntries([]);
      return;
    }

    // 初期状態: 全エリアloading
    const initial: MultiScheduleEntry[] = areaIds.map((id) => ({
      areaId: id,
      schedule: null,
      loading: true,
      error: null,
    }));
    setEntries(initial);

    // 各エリアを並列取得
    areaIds.forEach((areaId, idx) => {
      const area = AREAS.find((a) => a.id === areaId);
      if (!area || area.theaters.length === 0) {
        setEntries((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], loading: false, error: "エリアが見つかりません" };
          return next;
        });
        return;
      }

      const theater = area.theaters[0];
      const path = `${DATA_BASE_PATH}/data/schedules/${theater.chain}/${theater.area}_${date}.json`;

      fetch(path)
        .then((res) => {
          if (!res.ok) throw new Error(`データなし (${res.status})`);
          return res.json();
        })
        .then((data: Schedule) => {
          setEntries((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], schedule: data, loading: false };
            return next;
          });
        })
        .catch((e) => {
          setEntries((prev) => {
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              loading: false,
              error: e instanceof Error ? e.message : "取得失敗",
            };
            return next;
          });
        });
    });
  }, [areaIds.join(","), date]);

  const allLoading = entries.some((e) => e.loading);
  const anyError = entries.some((e) => e.error !== null);

  return { entries, allLoading, anyError };
}
