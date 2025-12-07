// src/services/questions.service.ts
import { mockQuestions } from "../mock/questions";
import type { Question } from "../types/question";

export type SortDirection = "asc" | "desc";

export interface QuestionStats {
  total: number;
  avgResponse: number;
  successRate: number;
}

export interface QuestionsQuery {
  search?: string;
  from?: Date | null;
  to?: Date | null;
  sortBy?: "timestamp";
  sortDirection?: SortDirection;
}

export interface QuestionsResult {
  items: Question[];
  stats: QuestionStats;
}

export function query({
  search,
  from,
  to,
  sortBy = "timestamp",
  sortDirection = "desc",
}: QuestionsQuery): QuestionsResult {
  let filtered = [...mockQuestions];

  if (search) {
    const lowered = search.toLowerCase();
    filtered = filtered.filter((item) => {
      const haystack =
        `${item.question} ${item.answer} ${item.author.email}`.toLowerCase();
      return haystack.includes(lowered);
    });
  }

  // 📆 פילטר לפי תאריכים
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
  // אם שניהם null – אין פילטר תאריך

  // ⏱ סורט – כרגע רק לפי timestamp, כמו קודם
  let sorted = filtered;
  if (sortBy === "timestamp") {
    sorted = filtered.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      if (sortDirection === "asc") {
        return aTime - bTime;
      }
      return bTime - aTime;
    });
  }

  // 📊 סטטיסטיקות – על כל המוקים (כמו שהיה)
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
}
