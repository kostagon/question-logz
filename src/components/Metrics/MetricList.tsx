import DatabaseIcon from "../../styles/Icons/DatabaseIcon";
import ClockIcon from "../../styles/Icons/ClockIcon";
import CheckIcon from "../../styles/Icons/CheckIcon";
import { QuestionStats } from "../../services/question.service";
import MetricCard from "./MetricCard";

export default function MetricList({ stats }: { stats: QuestionStats }) {
  const items = [
    {
      title: "Total queries",
      data: stats.total,
      icon: <DatabaseIcon className="w-6 h-6" />,
      color: "purple",
    },
    {
      title: "Avg. response",
      data: `${stats.avgResponse}ms`,
      icon: <ClockIcon className="w-6 h-6" />,
      color: "blue",
    },
    {
      title: "Success rate",
      data: `${stats.successRate}%`,
      icon: <CheckIcon className="w-6 h-6" />,
      color: "green",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {items.map((item) => (
        <MetricCard key={item.title} item={item} />
      ))}
    </div>
  );
}
