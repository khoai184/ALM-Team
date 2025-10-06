import { useParams } from "react-router-dom";
import ProfileNavbar from "../../../components/ProfileNavbar";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  
  // Mock data cho khóa học chi tiết
  const course = {
    id: 1,
    title: "Python căn bản",
    logo: "🐍",
    progress: 74,
    instructor: "Nguyễn Văn Demo",
    status: "Đang học",
    description: "Khóa học Python cơ bản dành cho người mới bắt đầu. Học từ cú pháp cơ bản đến các thư viện quan trọng.",
    duration: "3 tháng",
    level: "Cơ bản",
    students: 150,
    rating: 4.8
  };

  const studyGroups = [
    {
      id: 1,
      name: "PT001_2025 - Tháng 9/2025",
      members: [
        { name: "Nguyễn Văn A", avatar: "👨" },
        { name: "Trần Thị B", avatar: "👩" },
        { name: "Lê Văn C", avatar: "👨" },
        { name: "Phạm Thị D", avatar: "👩" }
      ],
      role: "Member"
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

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tải ảnh đại diện
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ảnh cá nhân
                  </button>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Chỉnh sửa hồ sơ
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Đang học</span>
                </div>
              </div>
            </div>

            {/* Right Content - Course Detail */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Khóa học của tôi</h1>
              
              {/* Course Detail Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="text-6xl mr-6">{course.logo}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm text-white">👤</span>
                        </div>
                        <span className="text-lg text-gray-600">{course.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>⭐ {course.rating}</span>
                        <span>👥 {course.students} học viên</span>
                        <span>📅 {course.duration}</span>
                        <span>📊 {course.level}</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                    Vào học
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-medium text-gray-700">Tiến độ khóa học</span>
                    <span className="text-lg font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả khóa học</h3>
                  <p className="text-gray-600 leading-relaxed">{course.description}</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-6 border-b border-gray-200">
                  <button className="pb-3 text-lg font-medium text-blue-600 border-b-2 border-blue-600">
                    Tổng quan
                  </button>
                  <button className="pb-3 text-lg font-medium text-gray-500 hover:text-gray-700">
                    Lịch học
                  </button>
                </div>
              </div>

              {/* Study Groups Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nhóm học tập</h2>
                <div className="space-y-4">
                  {studyGroups.map((group) => (
                    <div key={group.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex -space-x-2">
                              {group.members.map((member, index) => (
                                <div key={index} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm border-2 border-white">
                                  {member.avatar}
                                </div>
                              ))}
                            </div>
                            <span className="ml-3 text-sm text-gray-600">
                              {group.members.length} thành viên
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Xem nhóm
                          </button>
                          <p className="text-xs text-gray-500 mt-1">{group.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
