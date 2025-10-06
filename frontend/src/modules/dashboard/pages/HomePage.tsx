// import keycloak from "../../auth/services/keycloak";
import DashboardCard from "../components/DashboardCard";
// import Keycloak from "keycloak-js";
// import KeycloakService from "../../auth/services/keycloakService";
import HomeNavbar from "../../../components/HomeNavbar";



export default function HomePage() {
  // Lấy thông tin user từ localStorage
  const getUserInfo = () => {
    try {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  const user = getUserInfo();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  return (
    <div>
      <HomeNavbar />
      <div className="space-y-6">
      {/* User Info Card */}
      {user ? (
        <div className="mt-5 bg-white shadow-lg rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin người dùng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-20">ID:</span>
                <span className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">{user.id}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-20">Username:</span>
                <span className="text-gray-900">{user.username}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-20">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-20">Role:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 
                   user.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-20">Token:</span>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded truncate">
                  {localStorage.getItem('auth_token')?.substring(0, 20)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Chưa có thông tin người dùng. Vui lòng đăng nhập.</p>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <DashboardCard title="Thông báo" description="Các thông báo mới nhất từ CodeGym" />
        <DashboardCard title="Khóa học" description="Danh sách khóa học bạn đang tham gia" />
        <DashboardCard title="Điểm số" description="Theo dõi tiến trình và thành tích" />
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
      </div>
    </div>
  );
}