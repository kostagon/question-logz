import { mockQuestions } from "../mock/questions";
import type { Question } from "../types/question";

export type SortDirection = "asc" | "desc";

export interface MetricData {
  total: number;
  avgResponse: number;
  successRate: number;
}

export interface QuestionsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  from?: Date | null;
  to?: Date | null;
  sortBy?: "timestamp";
  sortDirection?: SortDirection;
}

export interface QuestionsResult {
  items: Question[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  metrics: MetricData;
}

export function query({
  page = 1,
  pageSize = 10,
  search,
  from,
  to,
  sortBy = "timestamp",
  sortDirection = "desc",
}: QuestionsQuery): QuestionsResult {
  let filtered = [...mockQuestions];

  // Filter by text:
  if (search) {
    const lowered = search.toLowerCase();
    filtered = filtered.filter((item) => {
      const haystack =
        `${item.question} ${item.answer} ${item.author.email}`.toLowerCase();
      return haystack.includes(lowered);
    });
  }

  // Filter by date:
  if (from && to) {
    const startTime = from.getTime();
    const endOfDay = new Date(to);
    endOfDay.setHours(23, 59, 59, 999);

    filtered = filtered.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime >= startTime && itemTime <= endOfDay.getTime();
    });
  } else if (from && !to) {
    const startTime = from.getTime();
    filtered = filtered.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime >= startTime;
    });
  }

  // Sort (only by timestamp)
  let sorted = filtered;
  if (sortBy === "timestamp") {
    sorted = filtered.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });
  }

  // From now on: 'total' is our sorted & filtered data.
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = sorted.slice(startIndex, endIndex);

  // Metrics: globalTotal, avgResponse, completedCount
  const globalTotal = mockQuestions.length;

  const avgResponse =
    Math.round(
      mockQuestions.reduce((sum, q) => sum + q.responseTimeMs, 0) / globalTotal
    ) || 0;

  const completedCount = mockQuestions.filter(
    (q) => q.status === "Completed"
  ).length;

  const successRate = Math.round((completedCount / globalTotal) * 100) || 0;

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
    metrics: {
      total: globalTotal,
      avgResponse,
      successRate,
    },
  };
}
