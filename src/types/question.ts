import { User } from "./user";

export type QuestionStatus = "Completed" | "Pending" | "Failed";

export interface Question {
  id: string;
  author: User;
  question: string;
  answer: string;
  timestamp: string;
  responseTimeMs: number;
  status: QuestionStatus;
}
