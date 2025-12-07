import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../design-system/components/Card";
import Button from "../design-system/components/Button";
import { mockQuestions } from "../mock/questions";
import { formatTimestamp, getInitials } from "../services/util.service";
import { DurationCell } from "../components/DurationCell";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const item = mockQuestions.find((q) => q.id === id);
  const navigate = useNavigate();

  if (!item)
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Question Not Found
          </h1>
          <p className="text-muted mb-4">
            The question you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Back to Question Log</Button>
        </div>
      </div>
    );

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Button onClick={() => navigate(-1)} className="mb-6">
            ← Back
          </Button>
        </div>

        {/* Metadata Bar */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                {getInitials(item.userEmail)}
              </div>
              <div>
                <p className="text-xs text-muted">User</p>
                <p className="text-sm font-medium text-gray-900">
                  {item.userEmail}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-border"></div>

            <div>
              <p className="text-xs text-muted">Timestamp</p>
              <p className="text-sm font-medium text-gray-900">
                {formatTimestamp(item.timestamp)}
              </p>
            </div>

            <div className="h-8 w-px bg-border"></div>

            <div>
              <p className="text-xs text-muted">Response Time</p>
              <DurationCell duration={item.responseTimeMs} />
            </div>
          </div>
        </Card>

        {/* Question & Response */}
        <Card>
          <div className="mb-8">
            <p className="text-lg uppercase text-muted font-semibold mb-3">
              Question
            </p>
            <h2 className="text-md text-gray-900 leading-relaxed">
              {item.question}
            </h2>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-lg uppercase text-muted font-semibold mb-3">
              AI Response
            </p>
            <div className="text-md text-gray-800 leading-relaxed whitespace-pre-wrap">
              {item.answer}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
