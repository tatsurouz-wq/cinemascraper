"use client";

import { useState, useMemo } from "react";
import { AreaSelector } from "@/components/AreaSelector";
import { DatePicker } from "@/components/DatePicker";
import { ComparisonView } from "@/components/ComparisonView";
import TimeFilter from "@/components/TimeFilter";
import { useMultiSchedule } from "@/hooks/useMultiSchedule";
import { useAreaComparison } from "@/hooks/useAreaComparison";
import { useTimeFilter } from "@/hooks/useTimeFilter";
import { DEFAULT_SELECTED_AREAS, MAX_COMPARE_AREAS } from "@/lib/constants";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    DEFAULT_SELECTED_AREAS
  );
  const [date, setDate] = useState(getToday());

  const timeFilter = useTimeFilter();

  const { entries } = useMultiSchedule(selectedAreas, date);

  // 時間フィルター適用後のスケジュール
  const filteredSchedules = useMemo(
    () => entries.map((e) => timeFilter.filterSchedule(e.schedule)),
    [entries, timeFilter.filterSchedule]
  );

  const { commonMovies } = useAreaComparison(filteredSchedules);

  // ComparisonView用パネルデータ
  const panels = entries.map((entry, idx) => ({
    schedule: filteredSchedules[idx],
    loading: entry.loading,
    error: entry.error,
    areaId: entry.areaId,
  }));

  const handleAreaChange = (index: number, newAreaId: string) => {
    setSelectedAreas((prev) => {
      const next = [...prev];
      next[index] = newAreaId;
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">🎬 CineSync</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            関東全域の映画スケジュールを比較（109シネマズ・TOHOシネマズ 38劇場）
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* 日付選択 + 時間フィルター */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DatePicker selectedDate={date} onDateChange={setDate} />
          <TimeFilter
            startHour={timeFilter.startHour}
            endHour={timeFilter.endHour}
            onStartChange={timeFilter.setStartHour}
            onEndChange={timeFilter.setEndHour}
            onPreset={timeFilter.applyPreset}
            isActive={timeFilter.isActive}
          />
        </div>

        {/* エリア選択（5つ） */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {selectedAreas.map((areaId, idx) => (
            <AreaSelector
              key={idx}
              index={idx}
              selectedArea={areaId}
              onAreaChange={(newId) => handleAreaChange(idx, newId)}
              disabledAreas={selectedAreas.filter((_, i) => i !== idx)}
            />
          ))}
        </div>

        {/* 比較ビュー */}
        <ComparisonView panels={panels} commonMovies={commonMovies} />

        {/* フッター */}
        <footer className="text-center py-6 text-xs text-gray-400">
          <p>CineSync - オープンソース映画スケジュール比較</p>
          <p className="mt-1">データは毎日自動更新されます</p>
        </footer>
      </div>
    </main>
  );
}
