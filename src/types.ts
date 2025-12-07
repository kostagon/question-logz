export type QuestionStatus = "Completed" | "In progress" | "Delayed";

export interface QuestionLogItem {
  id: string;
  userId: string;
  userEmail: string;
  question: string;
  answer: string;
  timestamp: string; // ISO string
  responseTimeMs: number;
  status: QuestionStatus;
}
