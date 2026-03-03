"use client";

import { useEffect, useState } from "react";
import type { Schedule } from "@/lib/types";
import { DATA_BASE_PATH } from "@/lib/constants";

interface UseScheduleResult {
  schedule: Schedule | null;
  loading: boolean;
  error: string | null;
}

/** 指定劇場・日付のスケジュールを取得 */
export function useSchedule(
  chain: string,
  area: string,
  date: string
): UseScheduleResult {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chain || !area || !date) {
      setLoading(false);
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const path = `${DATA_BASE_PATH}/data/schedules/${chain}/${area}_${date}.json`;
        const res = await fetch(path);
        if (!res.ok) throw new Error(`スケジュールが見つかりません (${res.status})`);
        const data: Schedule = await res.json();
        setSchedule(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "取得に失敗しました");
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [chain, area, date]);

  return { schedule, loading, error };
}
