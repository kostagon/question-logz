export function DurationCell({ duration }: { duration: number }) {
  const isSlow = duration > 2000;
  return (
    <span
      className={`text-sm font-medium ${
        isSlow ? "text-red-600" : "text-gray-700"
      }`}
    >
      {duration}ms
    </span>
  );
}
