import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionTable from "../components/Table/QuestionTable";
import { Pagination } from "../components/Pagination";
import {
  DateRangePicker,
  DateRange,
} from "../components/Filters/DateRangePicker";
import { query, SortDirection } from "../services/question.service";
import MetricList from "../components/Metrics/MetricList";
import FilterByText from "../components/Filters/FilterByText";

export default function QuestionsLogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    setPage(1);
  }, [search, dateRange]);

  const {
    items,
    page: currentPage,
    pageSize: effectivePageSize,
    total,
    totalPages,
    stats,
  } = useMemo(
    () =>
      query({
        page,
        pageSize,
        search,
        from: dateRange.start,
        to: dateRange.end,
        sortBy: "timestamp",
        sortDirection,
      }),
    [page, pageSize, search, dateRange, sortDirection]
  );

  const handleToggleTimestampSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mt-1">
              Question Log
            </h1>
            <p className="text-muted mt-2">
              Monitor and analyze AI interactions in real-time.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <FilterByText
              value={search}
              onChange={setSearch}
              placeholder="Search queries..."
            />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>
        <MetricList stats={stats} />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Question Log</h2>
            <span className="text-xs text-muted-foreground">
              Showing {items.length} of {total}
            </span>
          </div>

          <QuestionTable
            items={items}
            onSelect={(id) => navigate(`/questions/${id}`)}
            onToggleTimestampSort={handleToggleTimestampSort}
            sortDirection={sortDirection}
          />

          <Pagination
            page={currentPage}
            totalItems={total}
            pageSize={effectivePageSize}
            onPageChange={setPage}
          />
        </section>
      </div>
    </div>
  );
}
