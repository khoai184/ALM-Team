import ProfileNavbar from "../../../components/ProfileNavbar";

export default function CoursesPage() {
  // Mock data cho khóa học
  const courses = [
    {
      id: 1,
      title: "Python căn bản",
      logo: "🐍",
      progress: 74,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    },
    {
      id: 2,
      title: "Web Front-end Development",
      logo: "🌐",
      progress: 50,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    },
    {
      id: 3,
      title: "Quản lý mã nguồn với Git",
      logo: "📦",
      progress: 27,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    },
    {
      id: 4,
      title: "SQL trong phân tích dữ liệu",
      logo: "🐬",
      progress: 32,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    },
    {
      id: 5,
      title: "Game Development with Unity",
      logo: "🎮",
      progress: 36,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    },
    {
      id: 6,
      title: "Nhập môn phân tích dữ liệu",
      logo: "📊",
      progress: 67,
      instructor: "Nguyễn Văn Demo",
      status: "Đang học"
    }
  ];

  return (
    <div>
      <ProfileNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=face" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Nguyễn Văn Demo</h2>
                  <p className="text-gray-600">CodeGym Software</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Đang học</span>
                </div>
              </div>
            </div>

            {/* Right Content - Courses */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Khóa học của tôi</h1>
              
              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-4xl mr-4">{course.logo}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs text-white">👤</span>
                            </div>
                            <span className="text-sm text-gray-600">{course.instructor}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.location.href = `/courses/${course.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Vào học
                      </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Tiến độ</span>
                        <span className="text-sm font-semibold text-blue-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-gray-200">
                      <button className="pb-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                        Tổng quan
                      </button>
                      <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Lịch học
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
