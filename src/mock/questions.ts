import { Question } from "../types/question";
import { getDate } from "../services/util.service";

// Today
const today = getDate(0);
const todayMorning = getDate(0, 9, 30);
const todayAfternoon = getDate(0, 15, 45);

// Last 7 days
const day1 = getDate(1, 10, 20);
const day2 = getDate(2, 14, 30);
const day3 = getDate(3, 11, 15);
const day4 = getDate(4, 16, 45);
const day5 = getDate(5, 9, 0);
const day6 = getDate(6, 13, 20);

// Last 30 days
const week1 = getDate(7, 10, 0);
const week2 = getDate(10, 14, 30);
const week3 = getDate(15, 11, 45);
const week4 = getDate(20, 16, 0);
const week5 = getDate(25, 9, 30);
const week6 = getDate(28, 13, 15);

// Older dates
const month1 = getDate(35, 10, 0);
const month2 = getDate(45, 14, 0);
const month3 = getDate(60, 11, 0);

// --- ORIGINAL MOCKS ------------------------------------------

const baseMockQuestions: Question[] = [
  // Today (3 items)
  {
    id: "q-today-1",
    author: {
      id: "alex.dev",
      email: "alex.dev@team.co",
    },
    question:
      "How do I implement a binary search tree in Python? Looking for a simple implementation that is easy to explain to juniors.",
    answer:
      "Here is a simple implementation of a BST class in Python with insert, find, and traversal methods. You can extend it with delete as needed.",
    timestamp: todayAfternoon,
    responseTimeMs: 620,
    status: "Completed",
  },
  {
    id: "q-today-2",
    author: { id: "student.maria", email: "student.maria@edu.co" },
    question: 'Translate "Where is the library?" to Spanish',
    answer: "¿Dónde está la biblioteca?",
    timestamp: todayMorning,
    responseTimeMs: 350,
    status: "Completed",
  },
  {
    id: "q-today-3",
    author: { id: "ops.analytics", email: "ops.analytics@corp.co" },
    question:
      "Generate a report for Q3 sales data grouped by region and product",
    answer:
      "Aggregated Q3 sales with per-region and per-product breakdowns attached in the CSV. Noting anomalies in EU-West.",
    timestamp: today,
    responseTimeMs: 4200,
    status: "Pending",
  },
  // Last 7 days (6 items)
  {
    id: "q-day1",
    author: { id: "user1", email: "user1@example.com" },
    question: "What is the best way to handle async operations in React?",
    answer:
      "Use useEffect with proper dependency arrays, or consider using React Query for server state management.",
    timestamp: day1,
    responseTimeMs: 890,
    status: "Completed",
  },
  {
    id: "q-day2",
    author: { id: "user2", email: "user2@example.com" },
    question:
      "Explain the difference between let, const, and var in JavaScript",
    answer:
      "var is function-scoped and hoisted, let and const are block-scoped. const prevents reassignment, let allows it.",
    timestamp: day2,
    responseTimeMs: 450,
    status: "Completed",
  },
  {
    id: "q-day3",
    author: { id: "user3", email: "user3@example.com" },
    question: "How do I optimize database queries for large datasets?",
    answer:
      "Use indexes on frequently queried columns, implement pagination, and consider query optimization techniques like EXPLAIN.",
    timestamp: day3,
    responseTimeMs: 2100,
    status: "Completed",
  },
  {
    id: "q-day4",
    author: { id: "user4", email: "user4@example.com" },
    question: "What are the benefits of using TypeScript over JavaScript?",
    answer:
      "TypeScript provides static typing, better IDE support, early error detection, and improved code maintainability.",
    timestamp: day4,
    responseTimeMs: 680,
    status: "Completed",
  },
  {
    id: "q-day5",
    author: { id: "user5", email: "user5@example.com" },
    question: "How to implement authentication in a Next.js application?",
    answer:
      "You can use NextAuth.js, implement JWT tokens, or use third-party services like Auth0 or Clerk.",
    timestamp: day5,
    responseTimeMs: 1200,
    status: "Completed",
  },
  {
    id: "q-day6",
    author: { id: "user6", email: "user6@example.com" },
    question: "What is the difference between REST and GraphQL?",
    answer:
      "REST uses multiple endpoints with fixed data structures, while GraphQL uses a single endpoint with flexible queries.",
    timestamp: day6,
    responseTimeMs: 950,
    status: "Completed",
  },

  // Last 30 days (6 items)
  {
    id: "q-week1",
    author: { id: "user7", email: "user7@example.com" },
    question: "How do I set up CI/CD pipeline with GitHub Actions?",
    answer:
      "Create a .github/workflows YAML file, define jobs and steps, and configure triggers for your workflow.",
    timestamp: week1,
    responseTimeMs: 1500,
    status: "Completed",
  },
  {
    id: "q-week2",
    author: { id: "user8", email: "user8@example.com" },
    question: "What are microservices and when should I use them?",
    answer:
      "Microservices are independently deployable services. Use them when you need scalability, team autonomy, or technology diversity.",
    timestamp: week2,
    responseTimeMs: 1800,
    status: "Completed",
  },
  {
    id: "q-week3",
    author: { id: "user9", email: "user9@example.com" },
    question: "Explain Docker containers and their benefits",
    answer:
      "Docker containers package applications with dependencies. Benefits include consistency, isolation, and easy deployment.",
    timestamp: week3,
    responseTimeMs: 1100,
    status: "Completed",
  },
  {
    id: "q-week4",
    author: { id: "user10", email: "user10@example.com" },
    question: "How to implement caching strategies in web applications?",
    answer:
      "Use browser caching, CDN caching, Redis for server-side caching, and implement cache invalidation strategies.",
    timestamp: week4,
    responseTimeMs: 750,
    status: "Completed",
  },
  {
    id: "q-week5",
    author: { id: "user11", email: "user11@example.com" },
    question: "What is the difference between SQL and NoSQL databases?",
    answer:
      "SQL databases are relational with structured schemas, while NoSQL databases are non-relational and flexible.",
    timestamp: week5,
    responseTimeMs: 1300,
    status: "Completed",
  },
  {
    id: "q-week6",
    author: { id: "user12", email: "user12@example.com" },
    question: "How do I implement real-time features using WebSockets?",
    answer:
      "Use libraries like Socket.io, establish WebSocket connections, and implement event handlers for real-time communication.",
    timestamp: week6,
    responseTimeMs: 2000,
    status: "Completed",
  },

  // Older dates (3 items)
  {
    id: "q-month1",
    author: { id: "user13", email: "user13@example.com" },
    question: "What are design patterns and why are they important?",
    answer:
      "Design patterns are reusable solutions to common problems. They improve code quality, maintainability, and team communication.",
    timestamp: month1,
    responseTimeMs: 980,
    status: "Completed",
  },
  {
    id: "q-month2",
    author: { id: "user14", email: "user14@example.com" },
    question: "How to handle errors in async/await functions?",
    answer:
      "Use try-catch blocks, handle promise rejections, and implement proper error boundaries in your application.",
    timestamp: month2,
    responseTimeMs: 650,
    status: "Completed",
  },
  {
    id: "q-month3",
    author: { id: "user15", email: "user15@example.com" },
    question: "Explain the concept of state management in React",
    answer:
      "State management involves storing and updating application data. Options include useState, Context API, Redux, or Zustand.",
    timestamp: month3,
    responseTimeMs: 1400,
    status: "Completed",
  },

  // Additional items for pagination/scrolling (10 more items across different dates)
  {
    id: "q-extra-1",
    author: { id: "user16", email: "user16@example.com" },
    question: "What is the difference between HTTP and HTTPS?",
    answer:
      "HTTPS is HTTP with SSL/TLS encryption, providing secure data transmission and preventing man-in-the-middle attacks.",
    timestamp: getDate(8, 11, 30),
    responseTimeMs: 520,
    status: "Completed",
  },
  {
    id: "q-extra-2",
    author: { id: "user17", email: "user17@example.com" },
    question: "How do I optimize images for web performance?",
    answer:
      "Use modern formats like WebP, implement lazy loading, compress images, and use responsive images with srcset.",
    timestamp: getDate(12, 15, 0),
    responseTimeMs: 1100,
    status: "Completed",
  },
  {
    id: "q-extra-3",
    author: { id: "user18", email: "user18@example.com" },
    question: "What is the purpose of API versioning?",
    answer:
      "API versioning allows you to make changes without breaking existing clients, maintaining backward compatibility.",
    timestamp: getDate(18, 9, 45),
    responseTimeMs: 870,
    status: "Completed",
  },
  {
    id: "q-extra-4",
    author: { id: "user19", email: "user19@example.com" },
    question: "Explain the concept of serverless computing",
    answer:
      "Serverless computing runs code without managing servers, automatically scaling and charging only for execution time.",
    timestamp: getDate(22, 14, 20),
    responseTimeMs: 1600,
    status: "Completed",
  },
  {
    id: "q-extra-5",
    author: { id: "user20", email: "user20@example.com" },
    question: "How to implement pagination in a REST API?",
    answer:
      "Use query parameters like page and limit, return metadata about total pages, and implement cursor-based pagination for better performance.",
    timestamp: getDate(26, 10, 15),
    responseTimeMs: 720,
    status: "Completed",
  },
  {
    id: "q-extra-6",
    author: { id: "user21", email: "user21@example.com" },
    question: "What are the benefits of using a monorepo?",
    answer:
      "Monorepos enable code sharing, unified versioning, easier refactoring, and consistent tooling across projects.",
    timestamp: getDate(32, 13, 30),
    responseTimeMs: 1350,
    status: "Completed",
  },
  {
    id: "q-extra-7",
    author: { id: "user22", email: "user22@example.com" },
    question: "How do I secure my API endpoints?",
    answer:
      "Implement authentication (JWT, OAuth), use HTTPS, validate input, implement rate limiting, and follow security best practices.",
    timestamp: getDate(38, 11, 0),
    responseTimeMs: 1900,
    status: "Completed",
  },
  {
    id: "q-extra-8",
    author: { id: "user23", email: "user23@example.com" },
    question:
      "What is the difference between authentication and authorization?",
    answer:
      "Authentication verifies identity, while authorization determines what resources a user can access.",
    timestamp: getDate(42, 16, 45),
    responseTimeMs: 580,
    status: "Completed",
  },
  {
    id: "q-extra-9",
    author: { id: "user24", email: "user24@example.com" },
    question: "How to implement search functionality in a web application?",
    answer:
      "Use full-text search engines like Elasticsearch, implement fuzzy matching, and consider search indexing strategies.",
    timestamp: getDate(50, 9, 30),
    responseTimeMs: 2400,
    status: "Completed",
  },
  {
    id: "q-extra-10",
    author: { id: "user25", email: "user25@example.com" },
    question: "Explain the concept of database normalization",
    answer:
      "Database normalization reduces data redundancy and improves data integrity by organizing data into related tables.",
    timestamp: getDate(55, 12, 0),
    responseTimeMs: 1050,
    status: "Completed",
  },
];

// --- AUTO-GENERATED EXTRA MOCKS (100 more) -------------------

const generatedQuestions: Question[] = (() => {
  const questionTemplates = [
    "Summarize the following customer support conversation for an internal report.",
    "Generate test cases for a login form with email and password fields.",
    "Suggest improvements for the following API error message.",
    "Explain this stack trace and propose likely root causes.",
    "Generate SQL queries to answer typical analytics questions for an e-commerce store.",
    "Rewrite this technical description in simpler language for non-engineers.",
    "Draft a release note for a minor frontend performance improvement.",
    "Generate unit test ideas for a React component with multiple props and states.",
    "Describe trade-offs between optimistic and pessimistic locking in databases.",
    "Help me design a prompt to extract structured data from unstructured text.",
  ];

  const answerTemplates = [
    "Provided a concise summary highlighting key issues, resolutions, and next steps.",
    "Listed multiple test cases including happy paths, edge cases, and validation errors.",
    "Suggested clearer wording, added context, and actionable hints for the user.",
    "Explained the error flow, pointed to the failing layer, and recommended logging improvements.",
    "Created parameterized SQL examples for cohorts, retention, revenue, and funnel analysis.",
    "Rephrased jargon-heavy explanations into simple, user-friendly language.",
    "Outlined user-facing changes, performance gains, and any breaking changes.",
    "Proposed coverage for rendering states, input variations, and error boundaries.",
    "Compared both approaches, outlining when each is appropriate and potential pitfalls.",
    "Outlined a prompt structure with system instructions, examples, and formatting constraints.",
  ];

  const statuses: Array<Question["status"]> = [
    "Completed",
    "Completed",
    "Completed",
    "Pending",
  ];

  return Array.from({ length: 100 }, (_, index) => {
    const idNum = index + 1;
    const dayOffset = 60 + idNum; // push these further into the "past"
    const hourOptions = [9, 11, 13, 15, 17];
    const minuteOptions = [0, 10, 20, 30, 40, 50];

    const hour = hourOptions[index % hourOptions.length];
    const minute = minuteOptions[index % minuteOptions.length];

    return {
      id: `q-gen-${idNum}`,
      author: {
        id: `generated.user${idNum}`,
        email: `generated.user${idNum}@example.com`,
      },
      question: questionTemplates[index % questionTemplates.length],
      answer: answerTemplates[index % answerTemplates.length],
      timestamp: getDate(dayOffset, hour, minute),
      responseTimeMs: 400 + ((index * 37) % 2500), // some variety
      status: statuses[index % statuses.length],
    } as Question;
  });
})();

// --- FINAL EXPORT --------------------------------------------

export const mockQuestions: Question[] = [
  ...baseMockQuestions,
  ...generatedQuestions,
];
