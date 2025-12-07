import React, { useState, useMemo } from "react";
import Table from "./Table";
import LongTxt from "./LongTxt";
import { QuestionLogItem } from "../types";
import { formatTimestamp, getInitials } from "../services/util.service";
import { DurationCell } from "./DurationCell";
type SortDirection = "asc" | "desc" | null;

export default function QuestionTable({
  items,
  onSelect,
}: {
  items: QuestionLogItem[];
  onSelect: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedItems = useMemo(() => {
    if (!sortKey || sortKey !== "timestamp") {
      // Default: sort by timestamp descending (newest first)
      return [...items].sort((a, b) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    }

    // Stable sort: only sort by timestamp
    const sorted = [...items].sort((a, b) => {
      const aVal = new Date(a.timestamp).getTime();
      const bVal = new Date(b.timestamp).getTime();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      // Stable sort: maintain original order for equal timestamps using id
      return a.id.localeCompare(b.id);
    });

    return sorted;
  }, [items, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
      if (sortDirection === "desc") {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const columns = [
    {
      key: "question",
      label: "Question",
      headerIcon: ">_",
      sortable: false,
      render: (r: QuestionLogItem) => (
        <div className="flex flex-col gap-1">
          <LongTxt
            text={r.question}
            maxLength={60}
            className="font-semibold text-gray-900"
          />
          <LongTxt
            text={r.answer || "Preview unavailable"}
            maxLength={80}
            className="text-xs text-muted"
          />
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      sortable: false,
      render: (r: QuestionLogItem) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {getInitials(r.userEmail)}
          </div>
          <LongTxt
            text={r.userEmail}
            maxLength={20}
            className="text-sm text-gray-800"
          />
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      sortable: false,
      render: (r: QuestionLogItem) => (
        <DurationCell duration={r.responseTimeMs} />
      ),
    },
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (r: QuestionLogItem) => (
        <div className="text-sm text-gray-700">
          {formatTimestamp(r.timestamp)}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={sortedItems}
      onRowClick={(row: QuestionLogItem) => onSelect(row.id)}
      onSort={handleSort}
      sortKey={sortKey}
      sortDirection={sortDirection}
    />
  );
}
