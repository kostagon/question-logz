import React from "react";
export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none w-full shadow-sm hover:shadow-md transition-shadow"
    />
  );
}
