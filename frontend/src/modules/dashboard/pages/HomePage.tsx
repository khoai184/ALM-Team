import DashboardCard from "../components/DashboardCard";

export default function HomePage() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Thông báo" description="Các thông báo mới nhất từ CodeGym" />
        <DashboardCard title="Khóa học" description="Danh sách khóa học bạn đang tham gia" />
        <DashboardCard title="Điểm số" description="Theo dõi tiến trình và thành tích" />
      </div>
  );
}
