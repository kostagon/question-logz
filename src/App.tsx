import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import QuestionsLogPage from "./pages/QuestionsLogPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import LynkLogo from "./styles/Icons/LynkLogo";

export default function App() {
  return (
    <div>
      <nav className="bg-white border-b border-border py-4">
        <div className="max-w-6xl mx-auto flex gap-6 px-4 font-medium">
          <Link to="/" className="hover:opacity-80 transition">
            <LynkLogo className="h-8 text-gray-900" />
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<QuestionsLogPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
      </Routes>
    </div>
  );
}
