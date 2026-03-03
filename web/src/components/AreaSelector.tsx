"use client";

import { AREAS, PREFECTURES, MAX_COMPARE_AREAS } from "@/lib/constants";

interface AreaSelectorProps {
  index: number;
  selectedArea: string;
  onAreaChange: (areaId: string) => void;
  disabledAreas?: string[];
}

export function AreaSelector({
  index,
  selectedArea,
  onAreaChange,
  disabledAreas = [],
}: AreaSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        エリア {index + 1}
      </label>
      <select
        value={selectedArea}
        onChange={(e) => onAreaChange(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      >
        <option value="">-- 選択 --</option>
        {PREFECTURES.map((pref) => (
          <optgroup key={pref} label={pref}>
            {AREAS.filter((a) => a.prefecture === pref).map((area) => (
              <option
                key={area.id}
                value={area.id}
                disabled={
                  area.id !== selectedArea && disabledAreas.includes(area.id)
                }
              >
                {area.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
