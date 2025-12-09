import DatabaseIcon from "../../styles/Icons/DatabaseIcon";
import ClockIcon from "../../styles/Icons/ClockIcon";
import CheckIcon from "../../styles/Icons/CheckIcon";
import { MetricData } from "../../services/question.service";
import MetricCard, { MetricCardItem } from "./MetricCard";

export default function MetricList({ metrics }: { metrics: MetricData }) {
  const items: MetricCardItem[] = [
    {
      title: "Total queries",
      data: metrics.total,
      icon: <DatabaseIcon className="w-6 h-6" />,
      color: "purple",
    },
    {
      title: "Avg. response",
      data: `${metrics.avgResponse}ms`,
      icon: <ClockIcon className="w-6 h-6" />,
      color: "blue",
    },
    {
      title: "Success rate",
      data: `${metrics.successRate}%`,
      icon: <CheckIcon className="w-6 h-6" />,
      color: "green",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {items.map((item: MetricCardItem) => (
        <MetricCard key={item.title + " Metric card"} item={item} />
      ))}
    </div>
  );
}
