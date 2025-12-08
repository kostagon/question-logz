import React from "react";
export default function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-primary text-white rounded-xl2 hover:bg-violet-600 transition shadow-sm ${className}`.trim()}
    >
      {children}
    </button>
  );
}
