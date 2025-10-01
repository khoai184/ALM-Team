// import keycloak from "../../auth/services/keycloak";
import DashboardCard from "../components/DashboardCard";
// import Keycloak from "keycloak-js";
import KeycloakService from "../../auth/services/keycloakService";



export default function HomePage() {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <DashboardCard title="Thông báo" description="Các thông báo mới nhất từ CodeGym" />
        <DashboardCard title="Khóa học" description="Danh sách khóa học bạn đang tham gia" />
        <DashboardCard title="Điểm số" description="Theo dõi tiến trình và thành tích" />
       <button
        onClick={() => KeycloakService.doLogout({ redirectUri: window.location.origin + "/login" })}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Đăng xuất
      </button>

      </div>
  );
}