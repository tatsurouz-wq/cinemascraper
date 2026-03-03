"use client";

import { AREAS } from "@/lib/constants";

interface AreaSelectorProps {
  selectedArea: string;
  onAreaChange: (areaId: string) => void;
  label: string;
}

export function AreaSelector({
  selectedArea,
  onAreaChange,
  label,
}: AreaSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={selectedArea}
        onChange={(e) => onAreaChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      >
        {AREAS.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}（{area.prefecture}）
          </option>
        ))}
      </select>
    </div>
  );
}
