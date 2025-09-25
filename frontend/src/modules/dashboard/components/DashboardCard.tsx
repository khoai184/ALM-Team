interface Props {
  title: string;
  description: string;
}

export default function DashboardCard({ title, description }: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-6 hover:shadow-md transition cursor-pointer">
      <h2 className="font-semibold text-base md:text-lg mb-2">{title}</h2>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
    
  );
}
