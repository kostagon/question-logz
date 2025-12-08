import React from "react";
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card shadow-sm border border-border rounded-xl2 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
