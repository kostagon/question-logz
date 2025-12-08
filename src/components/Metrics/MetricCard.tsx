import Container from "../DesignSystem/Container";

export type MetricColor = "purple" | "green" | "blue";

export interface MetricCardItem {
  title: string;
  data: string | number;
  icon: JSX.Element;
  color: MetricColor;
}

const COLOR_STYLES: Record<MetricColor, string> = {
  purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
  green: "bg-green-100 text-green-600 group-hover:bg-green-200",
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
};

export default function MetricCard({ item }: { item: MetricCardItem }) {
  const { title, data, icon, color } = item;
  const colorClasses = COLOR_STYLES[color];

  return (
    <Container className="group hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data}</p>
        </div>
        <div
          className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors ${colorClasses}`}
        >
          {icon}
        </div>
      </div>
    </Container>
  );
}
