import { describe, it, expect } from "vitest";
import { query } from "./question.service";
import { mockQuestions } from "../mock/questions";

describe("question.service - query()", () => {
  it("returns paginated, sorted results with default params", () => {
    const result = query({});

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);

    // total should reflect filtered+sorted (default: all)
    expect(result.total).toBe(mockQuestions.length);
    expect(result.totalPages).toBeGreaterThanOrEqual(1);

    // metrics.total should reflect global dataset
    expect(result.metrics.total).toBe(mockQuestions.length);
    expect(result.items.length).toBeLessThanOrEqual(result.pageSize);

    // default sort is by timestamp desc (newest first)
    const firstTime = new Date(result.items[0].timestamp).getTime();
    const lastTime = new Date(
      result.items[result.items.length - 1].timestamp
    ).getTime();
    expect(firstTime).toBeGreaterThanOrEqual(lastTime);
  });

  it("filters by search text across question, answer and email", () => {
    // pick a phrase that should exist in at least one mock question
    const search = "binary search tree";

    const result = query({ search });

    expect(result.total).toBeGreaterThan(0);
    result.items.forEach((item) => {
      const haystack = (
        item.question +
        " " +
        item.answer +
        " " +
        item.author.email
      ).toLowerCase();
      expect(haystack).toContain(search.toLowerCase());
    });
  });

  it("filters by a specific date range (single day)", () => {
    // take one existing question's date and query for that whole day
    const target = mockQuestions[0].timestamp;
    const from = new Date(target);
    from.setHours(0, 0, 0, 0);
    const to = new Date(target);
    to.setHours(23, 59, 59, 999);

    const result = query({ from, to });

    // all returned items should fall within that day
    result.items.forEach((item) => {
      const t = new Date(item.timestamp).getTime();
      expect(t).toBeGreaterThanOrEqual(from.getTime());
      expect(t).toBeLessThanOrEqual(to.getTime());
    });
  });

  it("supports ascending sort by timestamp", () => {
    const result = query({ sortDirection: "asc" });

    expect(result.items.length).toBeGreaterThan(1);

    const firstTime = new Date(result.items[0].timestamp).getTime();
    const lastTime = new Date(
      result.items[result.items.length - 1].timestamp
    ).getTime();

    expect(firstTime).toBeLessThanOrEqual(lastTime);
  });

  it("applies pagination correctly", () => {
    const pageSize = 5;
    const firstPage = query({ page: 1, pageSize, sortDirection: "desc" });
    const secondPage = query({ page: 2, pageSize, sortDirection: "desc" });

    expect(firstPage.items.length).toBe(pageSize);
    expect(secondPage.items.length).toBeGreaterThan(0);

    // ensure no overlap between page 1 and page 2 ids
    const firstIds = new Set(firstPage.items.map((q) => q.id));
    secondPage.items.forEach((q) => {
      expect(firstIds.has(q.id)).toBe(false);
    });
  });

  it("computes metrics based on the full dataset, not the filtered page", () => {
    const result = query({
      search: "binary search tree",
      page: 2,
      pageSize: 3,
    });

    // metrics.total should always equal all mockQuestions length
    expect(result.metrics.total).toBe(mockQuestions.length);

    // avgResponse should be roughly the average of all questions
    const manualAvg =
      mockQuestions.reduce((sum, q) => sum + q.responseTimeMs, 0) /
      mockQuestions.length;

    expect(result.metrics.avgResponse).toBeCloseTo(manualAvg, 0);
  });
});
