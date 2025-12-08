import React from "react";

export default function LongText({
  text,
  maxLength = 100,
  className = "",
}: {
  text: string;
  maxLength?: number;
  className?: string;
}) {
  const truncated =
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <span className={`block truncate ${className}`} title={text}>
      {truncated}
    </span>
  );
}
