import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import QuestionTable from "../components/QuestionTable";
import { Pagination } from "../components/Pagination";
import { DateRangePicker, DateRange } from "../components/DateRangePicker";
import { query, SortDirection } from "../services/question.service";
import StatsList from "../components/StatsList";

export default function QuestionsLogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
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
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search queries"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-border bg-white px-4 py-3 pl-11 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                🔍
              </span>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>
        <StatsList stats={stats} />

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

        {/* <Container>
          <QuestionTable
            items={items}
            onSelect={(id) => navigate(`/questions/${id}`)}
            onToggleTimestampSort={handleToggleTimestampSort}
            sortDirection={sortDirection}
          />
        </Container> */}
      </div>
    </div>
  );
}
