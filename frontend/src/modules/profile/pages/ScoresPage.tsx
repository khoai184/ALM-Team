import ProfileNavbar from "../../../components/ProfileNavbar";

export default function ScoresPage() {
  return (
    <div>
      <ProfileNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Điểm số</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Trang điểm số đang được phát triển...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
