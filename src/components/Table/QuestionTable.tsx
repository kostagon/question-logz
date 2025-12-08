import React, { useState, useMemo } from "react";
import Table from "./Table";

import LongText from "../LongText";
import { Question } from "../../types/question";
import { formatTimestamp, getInitials } from "../../services/util.service";
import { DurationCell } from "./DurationCell";
type SortDirection = "asc" | "desc";

export default function QuestionTable({
  items,
  onSelect,
  onToggleTimestampSort,
  sortDirection,
}: {
  items: Question[];
  onSelect: (id: string) => void;
  onToggleTimestampSort?: () => void;
  sortDirection: SortDirection;
}) {
  const [sortKey, setSortKey] = useState<string>("timestamp");

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const aVal = new Date(a.timestamp).getTime();
      const bVal = new Date(b.timestamp).getTime();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return a.id.localeCompare(b.id);
    });

    return sorted;
  }, [items, sortDirection]);

  const columns = [
    {
      key: "question",
      label: "Question",
      headerIcon: ">",
      sortable: false,
      render: (r: Question) => (
        <div className="flex flex-col gap-1">
          <LongText
            text={r.question}
            maxLength={60}
            className="font-semibold text-gray-900"
          />
          <LongText
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
      render: (r: Question) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {getInitials(r.author.email)}
          </div>
          <LongText
            text={r.author.email}
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
      render: (r: Question) => <DurationCell duration={r.responseTimeMs} />,
    },
    {
      key: "timestamp",
      label: "Timestamp",
      sortable: true,
      render: (r: Question) => (
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
      onRowClick={(row: Question) => onSelect(row.id)}
      onToggleTimestampSort={onToggleTimestampSort}
      sortKey={sortKey}
      sortDirection={sortDirection}
    />
  );
}
