# Question Logz 🤖

**Question Logz** is a lightweight frontend project for **exploring and inspecting queries sent to an AI system**.  
It demonstrates how AI prompts can be listed, filtered by time, and inspected in detail — similar to an AI observability or logging dashboard.

The app is frontend-only and uses a **mocked API call**, making it easy to later connect a real backend without changing the UI.

---

## ✨ Key Features

- List view of AI queries / prompts
- Query details inspection
- Advanced date filtering:
  - Presets (Today, Last 7 / 30 days, All time)
  - Custom range via calendar (month/year navigation)
  - Manual date input (`dd/mm/yyyy`)
- Mocked async API for backend-ready integration

---

## 🧱 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

---

## 🚀 Run Locally

```bash
git clone https://github.com/kostagon/question-logz.git
cd question-logz
npm install
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🧪 Tests

The project includes a small but focused test suite for the core data layer.  
The `question.service` is covered with unit tests that validate filtering, sorting, pagination, and metrics calculation logic.

Tests are written with **Vitest** and are designed to be lightweight, fast, and easy to extend when a real backend is introduced.

Run tests locally with:

```bash
npm run test
```

## 🎯 Purpose

This project serves as:

- a UI prototype for AI query observability tools
- a demonstration of advanced client-side filtering logic
- a clean base for adding a real backend later

---

## 📄 License

MIT
