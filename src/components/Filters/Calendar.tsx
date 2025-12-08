import React from "react";

interface CalendarProps {
  monthOffset?: number;
  start: Date | null;
  end: Date | null;
  onSelect?: (d: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  monthOffset = 0,
  start,
  end,
  onSelect = () => {},
}) => {
  const base = new Date();
  base.setMonth(base.getMonth() + monthOffset);
  base.setDate(1);

  const month = base.getMonth();
  const year = base.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isInRange = (d: Date) => {
    if (!start || !end) return false;
    return d >= start && d <= end;
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  return (
    <div className="p-3 border rounded-md w-56">
      <div className="text-center font-semibold mb-2">
        {base.toLocaleString("default", { month: "long" })} {year}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mb-1 opacity-70">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center gap-1">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = new Date(year, month, i + 1);
          const selected = isSameDay(d, start) || isSameDay(d, end);

          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`
                py-1 rounded
                ${selected ? "bg-blue-600 text-white" : ""}
                ${!selected && isInRange(d) ? "bg-blue-200" : ""}
                hover:bg-blue-300
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
