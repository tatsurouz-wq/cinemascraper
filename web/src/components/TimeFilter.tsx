"use client";

import { TIME_PRESETS, type TimePreset } from "@/hooks/useTimeFilter";

interface TimeFilterProps {
  startHour: number;
  endHour: number;
  onStartChange: (h: number) => void;
  onEndChange: (h: number) => void;
  onPreset: (preset: TimePreset) => void;
  isActive: boolean;
}

const HOURS = Array.from({ length: 25 }, (_, i) => i);

export default function TimeFilter({
  startHour,
  endHour,
  onStartChange,
  onEndChange,
  onPreset,
  isActive,
}: TimeFilterProps) {
  return (
    <div className="bg-white rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          ⏰ 時間フィルター
        </h3>
        {isActive && (
          <button
            onClick={() => onPreset(TIME_PRESETS[0])}
            className="text-xs text-blue-600 hover:underline"
          >
            リセット
          </button>
        )}
      </div>

      {/* プリセットボタン */}
      <div className="flex flex-wrap gap-1">
        {TIME_PRESETS.map((preset) => {
          const active =
            startHour === preset.startHour && endHour === preset.endHour;
          return (
            <button
              key={preset.label}
              onClick={() => onPreset(preset)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* カスタム時刻選択 */}
      <div className="flex items-center gap-2 text-sm">
        <select
          value={startHour}
          onChange={(e) => onStartChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm bg-white"
        >
          {HOURS.filter((h) => h < endHour).map((h) => (
            <option key={h} value={h}>
              {h}:00
            </option>
          ))}
        </select>
        <span className="text-gray-400">〜</span>
        <select
          value={endHour}
          onChange={(e) => onEndChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm bg-white"
        >
          {HOURS.filter((h) => h > startHour).map((h) => (
            <option key={h} value={h}>
              {h}:00
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
