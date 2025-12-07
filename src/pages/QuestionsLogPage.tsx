import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import QuestionTable from "../components/QuestionTable";
import DatabaseIcon from "../components/icons/DatabaseIcon";
import ClockIcon from "../components/icons/ClockIcon";
import CheckIcon from "../components/icons/CheckIcon";
import { DateRangePicker, DateRange } from "../components/DateRangePicker";
import { mockQuestions } from "../mock/questions";

export default function QuestionsLogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const { items, stats } = useMemo(() => {
    let filtered = [...mockQuestions];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((item) => {
        const haystack =
          `${item.question} ${item.answer} ${item.author.email}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      });
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startTime = dateRange.start.getTime();
      // Set end time to end of day
      const endOfDay = new Date(dateRange.end);
      endOfDay.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= startTime && itemTime <= endOfDay.getTime();
      });
    } else if (dateRange.start && !dateRange.end) {
      // If only start is selected, filter from that date onwards
      const startTime = dateRange.start.getTime();
      filtered = filtered.filter((item) => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= startTime;
      });
    }
    // If both are null, show all (no date filtering)

    // Sort by timestamp (newest first) by default
    const sorted = filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = mockQuestions.length;
    const avgResponse =
      Math.round(
        mockQuestions.reduce((sum, q) => sum + q.responseTimeMs, 0) / total
      ) || 0;
    const completedCount = mockQuestions.filter(
      (q) => q.status === "Completed"
    ).length;
    const successRate = Math.round((completedCount / total) * 100) || 0;

    return {
      items: sorted,
      stats: {
        total,
        avgResponse,
        successRate,
      },
    };
  }, [search, dateRange]);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="group hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted font-semibold">
                  Total queries
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <DatabaseIcon className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="group hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted font-semibold">
                  Avg. response
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.avgResponse}ms
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ClockIcon className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="group hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted font-semibold">
                  Success rate
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.successRate}%
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckIcon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Question Log
              </p>
              <p className="text-xs text-muted">Recent</p>
            </div>
          </div>

          <QuestionTable
            items={items}
            onSelect={(id) => navigate(`/questions/${id}`)}
          />
        </Card>
      </div>
    </div>
  );
}
