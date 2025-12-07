import React, { useState } from "react";

type SortDirection = "asc" | "desc" | null;

export default function Table<T extends { id?: string }>({
  columns,
  data,
  onRowClick,
  onSort,
  sortKey,
  sortDirection,
}: any) {
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide bg-gray-50">
            {columns.map((c: any) => {
              const isSortable = c.sortable !== false;
              const isActive = sortKey === c.key;
              const isHovered = hoveredHeader === c.key;

              return (
                <th
                  key={c.key}
                  className={`py-3 px-4 font-bold text-gray-700 ${
                    isHovered ? "bg-gray-100" : ""
                  } ${isSortable ? "cursor-pointer select-none" : ""}`}
                  onMouseEnter={() => setHoveredHeader(c.key)}
                  onMouseLeave={() => setHoveredHeader(null)}
                  onClick={() => isSortable && onSort?.(c.key)}
                >
                  <div className="flex items-center gap-2">
                    {c.headerIcon && <span>{c.headerIcon}</span>}
                    <span>{c.label}</span>

                    {isSortable && isActive && sortDirection && (
                      <span className="text-gray-600">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx: number) => (
            <tr
              key={row.id ?? idx}
              onClick={() => onRowClick?.(row)}
              className="border-t border-border hover:bg-gray-50 cursor-pointer transition"
            >
              {columns.map((c: any) => (
                <td
                  key={c.key}
                  className="py-4 px-4 align-middle overflow-hidden max-w-0"
                >
                  <div className="min-w-0">
                    {c.render ? c.render(row) : row[c.key]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
