import Container from "./Container";

export interface StatsItem {
  title: string;
  data: string | number;
  icon: JSX.Element;
  color: string;
}

export default function StatsItem({ item }: { item: StatsItem }) {
  const { title, data, icon, color } = item;

  console.log(`bg-${color}-100`);
  return (
    <Container className="group hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data}</p>
        </div>
        <div
          className={`h-11 w-11 rounded-full bg-${color}-100 text-${color}-600 flex items-center justify-center group-hover:bg-${color}-200 transition-colors`}
        >
          {icon}
        </div>
      </div>
    </Container>
  );
}
