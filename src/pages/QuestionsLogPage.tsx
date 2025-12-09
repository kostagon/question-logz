import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { query, SortDirection } from "../services/question.service";
import QuestionTable from "../components/Table/QuestionTable";
import { Pagination } from "../components/Pagination";
import {
  DateRangePicker,
  DateRange,
} from "../components/Filters/DateRangePicker";
import MetricList from "../components/Metrics/MetricList";
import FilterByText from "../components/Filters/FilterByText";

type QueryResult = ReturnType<typeof query>;

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

  const [data, setData] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0); // bump to re-run effect on retry

  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      try {
        setIsLoading(true);
        setHasError(false);

        // simulate an async API call; in real life this would be `await fetch(...)`
        const result = await Promise.resolve(
          query({
            page,
            pageSize,
            search,
            from: dateRange.start,
            to: dateRange.end,
            sortBy: "timestamp",
            sortDirection,
          })
        );

        if (cancelled) return;
        setData(result);
      } catch (err) {
        console.error("Failed to load questions:", err);
        if (!cancelled) {
          setHasError(true);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, dateRange, sortDirection, retryCount]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, dateRange]);

  const handleToggleTimestampSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDateRange({ start: null, end: null });
    setPage(1);
  };

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  const items = data?.items ?? [];
  const currentPage = data?.page ?? page;
  const effectivePageSize = data?.pageSize ?? pageSize;
  const total = data?.total ?? 0;
  const metrics =
    data?.metrics ??
    ({
      total: 0,
      avgResponse: 0,
      successRate: 0,
    } as QueryResult["metrics"]);

  const isEmpty = !hasError && !isLoading && total === 0;

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

        <MetricList metrics={metrics} />

        <section className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Question Log</h2>
            {!hasError && !isLoading && (
              <span className="text-xs text-muted-foreground">
                Showing {items.length} of {total}
              </span>
            )}
          </div>

          {/* --- Error state ------------------------------------------------ */}
          {hasError && (
            <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg p-4 flex flex-col gap-2">
              <p className="font-semibold text-sm">
                Something went wrong while loading questions.
              </p>
              <p className="text-xs opacity-80">
                This is a demo backed by a mock data layer. In a real
                integration this would surface backend/API errors.
              </p>
              <div>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* --- Loading state --------------------------------------------- */}
          {isLoading && !hasError && (
            <div className="border border-gray-100 rounded-lg p-6 bg-white text-sm text-gray-500">
              Loading questions…
            </div>
          )}

          {/* --- Empty state ----------------------------------------------- */}
          {isEmpty && (
            <div className="border border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-center bg-white">
              <p className="text-sm font-semibold text-gray-800">
                No questions match your filters.
              </p>
              <p className="text-xs text-gray-500 max-w-sm">
                Try adjusting the date range or search text to see more AI
                queries.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* --- Normal table + pagination --------------------------------- */}
          {!hasError && !isLoading && !isEmpty && (
            <>
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
            </>
          )}
        </section>
      </div>
    </div>
  );
}
