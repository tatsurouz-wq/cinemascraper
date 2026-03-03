"use client";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

/** 今日から7日分の日付を生成 */
function getDateOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const today = new Date();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = d.toISOString().split("T")[0];
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = weekdays[d.getDay()];
    const prefix = i === 0 ? "今日 " : i === 1 ? "明日 " : "";
    options.push({
      value,
      label: `${prefix}${month}/${day}（${weekday}）`,
    });
  }
  return options;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const options = getDateOptions();

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onDateChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
            ${
              selectedDate === opt.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
