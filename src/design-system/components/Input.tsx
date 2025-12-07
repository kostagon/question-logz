import React from "react";
export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="px-3 py-2 border border-border rounded-xl2 focus:ring-2 focus:ring-primary outline-none"
    />
  );
}
