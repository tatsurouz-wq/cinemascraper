"use client";

import { useState } from "react";
import { AreaSelector } from "@/components/AreaSelector";
import { DatePicker } from "@/components/DatePicker";
import { ComparisonView } from "@/components/ComparisonView";
import { useSchedule } from "@/hooks/useSchedule";
import { useAreaComparison } from "@/hooks/useAreaComparison";
import { AREAS, DEFAULT_PRESET } from "@/lib/constants";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [leftArea, setLeftArea] = useState(DEFAULT_PRESET.left);
  const [rightArea, setRightArea] = useState(DEFAULT_PRESET.right);
  const [date, setDate] = useState(getToday());

  const leftAreaData = AREAS.find((a) => a.id === leftArea);
  const rightAreaData = AREAS.find((a) => a.id === rightArea);

  const leftTheater = leftAreaData?.theaters[0];
  const rightTheater = rightAreaData?.theaters[0];

  const {
    schedule: leftSchedule,
    loading: leftLoading,
    error: leftError,
  } = useSchedule(
    leftTheater?.chain || "",
    leftTheater?.area || "",
    date
  );

  const {
    schedule: rightSchedule,
    loading: rightLoading,
    error: rightError,
  } = useSchedule(
    rightTheater?.chain || "",
    rightTheater?.area || "",
    date
  );

  const { commonMovies } = useAreaComparison(leftSchedule, rightSchedule);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">🎬 CineSync</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            映画スケジュールを比較して、デートプランを共有
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* 日付選択 */}
        <DatePicker selectedDate={date} onDateChange={setDate} />

        {/* エリア選択 */}
        <div className="grid grid-cols-2 gap-3">
          <AreaSelector
            label="エリア1"
            selectedArea={leftArea}
            onAreaChange={setLeftArea}
          />
          <AreaSelector
            label="エリア2"
            selectedArea={rightArea}
            onAreaChange={setRightArea}
          />
        </div>

        {/* 比較ビュー */}
        <ComparisonView
          leftSchedule={leftSchedule}
          rightSchedule={rightSchedule}
          commonMovies={commonMovies}
          leftLoading={leftLoading}
          rightLoading={rightLoading}
          leftError={leftError}
          rightError={rightError}
        />

        {/* フッター */}
        <footer className="text-center py-6 text-xs text-gray-400">
          <p>CineSync - オープンソース映画スケジュール比較</p>
          <p className="mt-1">データは毎日自動更新されます</p>
        </footer>
      </div>
    </main>
  );
}
