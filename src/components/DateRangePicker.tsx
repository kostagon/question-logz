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

const formatDDMMYYYY = (d: Date | null) => {
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDDMMYYYY = (value: string): Date | null => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);

  const d = new Date(year, month, day);

  // reject invalid dates (e.g. 31/02/2024)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month ||
    d.getDate() !== day
  ) {
    return null;
  }

  return d;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [mode, setMode] = useState<Mode>("allTime");
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // which month is currently shown (0 = current month, negative = past)
  const [monthOffset, setMonthOffset] = useState(0);

  // Close on outside click
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

  const isSameDate = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const setOffsetForDate = (d: Date) => {
    const today = new Date();
    const monthsDiff =
      (d.getFullYear() - today.getFullYear()) * 12 +
      (d.getMonth() - today.getMonth());
    setMonthOffset(monthsDiff);
  };

  // Sync range with value prop and determine mode
  useEffect(() => {
    setRange(value);

    if (!value.start && !value.end) {
      setMode("allTime");
      setMonthOffset(0);
    } else {
      const todayPreset = presets.find((p) => p.id === "today");
      const yesterdayPreset = presets.find((p) => p.id === "yesterday");
      const last7Preset = presets.find((p) => p.id === "last7");
      const last30Preset = presets.find((p) => p.id === "last30");

      if (
        todayPreset &&
        isSameDate(value.start, todayPreset.getRange().start) &&
        isSameDate(value.end, todayPreset.getRange().end)
      ) {
        setMode("today");
        setMonthOffset(0);
      } else if (
        yesterdayPreset &&
        isSameDate(value.start, yesterdayPreset.getRange().start) &&
        isSameDate(value.end, yesterdayPreset.getRange().end)
      ) {
        setMode("yesterday");
        setMonthOffset(0);
      } else if (
        last7Preset &&
        isSameDate(value.start, last7Preset.getRange().start) &&
        isSameDate(value.end, last7Preset.getRange().end)
      ) {
        setMode("last7");
        setMonthOffset(0);
      } else if (
        last30Preset &&
        isSameDate(value.start, last30Preset.getRange().start) &&
        isSameDate(value.end, last30Preset.getRange().end)
      ) {
        setMode("last30");
        setMonthOffset(0);
      } else {
        setMode("custom");
        if (value.start) {
          setOffsetForDate(value.start);
        }
      }
    }
    setStartInput(formatDDMMYYYY(value.start ?? null));
    setEndInput(formatDDMMYYYY(value.end ?? null));
  }, [value]);

  const applyPreset = (id: Mode) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setMode(id);
    const newRange = preset.getRange();
    setRange(newRange);
    onChange(newRange);
    setMonthOffset(0);
  };

  const handleCalendarSelect = (selected: Date) => {
    setMode("custom");
    setOffsetForDate(selected);
    setRange((prev) => {
      const { start, end } = prev;
      if (!start || (start && end)) {
        const newRange = { start: selected, end: null };
        onChange(newRange);
        return newRange;
      }
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

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInput(value); // <-- always let the user type
    setMode("custom");

    const parsed = parseDDMMYYYY(value);

    // Only update the actual range if:
    // - valid date, or
    // - cleared input
    setRange((prev) => {
      let { end } = prev;

      if (!parsed) {
        if (value === "") {
          const newRange = { start: null, end };
          onChange(newRange);
          return newRange;
        }
        // invalid partial string → don't touch range
        return prev;
      }

      let start = parsed;
      if (end && end < start) {
        [start, end] = [end, start];
      }

      const newRange = { start, end };
      onChange(newRange);
      setOffsetForDate(start);
      return newRange;
    });
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInput(value); // <-- always let the user type
    setMode("custom");

    const parsed = parseDDMMYYYY(value);

    setRange((prev) => {
      let { start } = prev;

      if (!parsed) {
        if (value === "") {
          const newRange = { start, end: null };
          onChange(newRange);
          return newRange;
        }
        return prev;
      }

      let end = parsed;
      if (start && end < start) {
        [start, end] = [end, start];
      }

      const newRange = { start, end };
      onChange(newRange);
      setOffsetForDate(end);
      return newRange;
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

  // label for nav bar
  const currentBase = new Date();
  currentBase.setDate(1);
  currentBase.setMonth(currentBase.getMonth() + monthOffset);
  const navLabel = currentBase.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-3">
              {/* NEW: date inputs */}
              <div className="flex gap-2 items-end">
                <div className="flex flex-col text-xs">
                  <label className="mb-1 text-gray-600">Start</label>
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="border rounded px-2 py-1 text-sm w-[120px]"
                    value={startInput}
                    onChange={handleStartInputChange}
                  />
                </div>

                <div className="flex flex-col text-xs">
                  <label className="mb-1 text-gray-600">End</label>
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="border rounded px-2 py-1 text-sm w-[120px]"
                    value={endInput}
                    onChange={handleEndInputChange}
                  />
                </div>
              </div>

              {/* NAV BAR — month/year navigation */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    onClick={() => setMonthOffset((m) => m - 12)}
                  >
                    « Year
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    onClick={() => setMonthOffset((m) => m - 1)}
                  >
                    ‹ Month
                  </button>
                </div>

                <div className="text-sm font-medium">{navLabel}</div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    onClick={() => setMonthOffset((m) => m + 1)}
                  >
                    Month ›
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    onClick={() => setMonthOffset((m) => m + 12)}
                  >
                    Year »
                  </button>
                </div>
              </div>

              {/* 2 CALENDARS — driven by monthOffset */}
              <div className="flex gap-4">
                <Calendar
                  monthOffset={monthOffset}
                  start={range.start}
                  end={range.end}
                  onSelect={handleCalendarSelect}
                />
                <Calendar
                  monthOffset={monthOffset + 1}
                  start={range.start}
                  end={range.end}
                  onSelect={handleCalendarSelect}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
