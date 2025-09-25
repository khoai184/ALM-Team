interface Props {
  title: string;
  description: string;
}

export default function DashboardCard({ title, description }: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
    
  );
}
