import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "./Calendar";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

type Mode = "allTime" | "today" | "yesterday" | "last7" | "last30" | "custom";

interface Preset {
  id: Mode;
  label: string;
  getRange: () => DateRange;
}

const presets: Preset[] = [
  {
    id: "allTime",
    label: "All Time",
    getRange: () => {
      return { start: null, end: null };
    },
  },
  {
    id: "today",
    label: "Today",
    getRange: () => {
      const d = new Date();
      return { start: d, end: d };
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getRange: () => {
      const d = new Date();
      const y = new Date(d);
      y.setDate(d.getDate() - 1);
      return { start: y, end: y };
    },
  },
  {
    id: "last7",
    label: "Last 7 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return { start, end };
    },
  },
  {
    id: "last30",
    label: "Last 30 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      return { start, end };
    },
  },
];

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [mode, setMode] = useState<Mode>("allTime");
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync range with value prop and determine mode
  useEffect(() => {
    setRange(value);

    // Determine mode from value
    if (!value.start && !value.end) {
      setMode("allTime");
    } else {
      const allTimePreset = presets.find((p) => p.id === "allTime");
      const todayPreset = presets.find((p) => p.id === "today");
      const yesterdayPreset = presets.find((p) => p.id === "yesterday");
      const last7Preset = presets.find((p) => p.id === "last7");
      const last30Preset = presets.find((p) => p.id === "last30");

      const isSameDate = (a: Date | null, b: Date | null) => {
        if (!a || !b) return false;
        return (
          a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate()
        );
      };

      if (
        todayPreset &&
        isSameDate(value.start, todayPreset.getRange().start) &&
        isSameDate(value.end, todayPreset.getRange().end)
      ) {
        setMode("today");
      } else if (
        yesterdayPreset &&
        isSameDate(value.start, yesterdayPreset.getRange().start) &&
        isSameDate(value.end, yesterdayPreset.getRange().end)
      ) {
        setMode("yesterday");
      } else if (
        last7Preset &&
        isSameDate(value.start, last7Preset.getRange().start) &&
        isSameDate(value.end, last7Preset.getRange().end)
      ) {
        setMode("last7");
      } else if (
        last30Preset &&
        isSameDate(value.start, last30Preset.getRange().start) &&
        isSameDate(value.end, last30Preset.getRange().end)
      ) {
        setMode("last30");
      } else {
        setMode("custom");
      }
    }
  }, [value]);

  const applyPreset = (id: Mode) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setMode(id);
    const newRange = preset.getRange();
    setRange(newRange);
    onChange(newRange);
  };

  const handleCalendarSelect = (selected: Date) => {
    setMode("custom");
    setRange((prev) => {
      const { start, end } = prev;
      // 1st click → set start
      if (!start || (start && end)) {
        const newRange = { start: selected, end: null };
        onChange(newRange);
        return newRange;
      }
      // 2nd click → set end (maintains chronological order)
      if (start && !end) {
        let newRange: DateRange;
        if (selected < start) {
          newRange = { start: selected, end: start };
        } else {
          newRange = { start, end: selected };
        }
        onChange(newRange);
        return newRange;
      }
      return prev;
    });
  };

  const formatDateRange = () => {
    if (!range.start && !range.end) return "All Time";
    if (range.start && !range.end) {
      return range.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    if (range.start && range.end) {
      if (range.start.getTime() === range.end.getTime()) {
        return range.start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return `${range.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${range.end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return "Select date range";
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full border border-border bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span className="text-muted">📅</span>
        <span className="text-gray-700">{formatDateRange()}</span>
        <span className="text-muted">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-card shadow-lg border border-border rounded-xl2 p-4">
          <div className="flex gap-4">
            {/* LEFT SIDE — PRESETS */}
            <div className="flex flex-col gap-2 w-40">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-2 text-left rounded ${
                    mode === p.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <div
                className={`px-3 py-2 text-left mt-4 rounded font-semibold ${
                  mode === "custom" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                Custom
              </div>
              <div className="text-sm mt-2 opacity-60">
                {range.start && range.end
                  ? `${range.start.toDateString()} → ${range.end.toDateString()}`
                  : "Select range..."}
              </div>
            </div>
            {/* RIGHT SIDE — 2 CALENDARS */}
            <div className="flex gap-4">
              <Calendar
                monthOffset={0}
                start={range.start}
                end={range.end}
                onSelect={handleCalendarSelect}
              />
              <Calendar
                monthOffset={1}
                start={range.start}
                end={range.end}
                onSelect={handleCalendarSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
