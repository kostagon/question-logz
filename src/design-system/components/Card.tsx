import React from "react";
export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card shadow-sm border border-border rounded-xl2 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
