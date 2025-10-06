import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import ProfileNavbar from "../../../components/ProfileNavbar";

// Interface cho ProfileResponse từ backend
interface ProfileResponse {
  user: {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    role: string;
    createdAt: string;
  };
  posts: Array<{
    id: number;
    content: string;
    privacy?: string;
    createdAt: string;
    updatedAt?: string;
    comments: Array<{
      id: number;
      userId: number;
      username: string;
      content: string;
      emotion?: string;
      fileId?: string;
      createdAt: string;
      replyComments: Array<{
        id: number;
        content: string;
        emotion?: string;
        fileId?: string;
        createdAt: string;
      }>;
    }>;
    reactions: Array<{
      id: number;
      userId: number;
      username: string;
      emotionType?: string;
      createdAt: string;
    }>;
  }>;
  images: Array<{
    id: number;
    imageUrl: string;
    description?: string;
    createdAt: string;
  }>;
  courses: Array<{
    id: number;
    courseName: string;
    description?: string;
    startDate?: string;
    tuitionFee?: number;
  }>;
}

function formatRelativeTime(from: number, to: number): string {
  const diffMs = Math.max(0, to - from);
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function ProfilePage() {
  // Live ticking to refresh relative time every 60s
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image">("all");
  const [mediaSortOrder, setMediaSortOrder] = useState<"asc" | "desc">("desc");
  const [openComments, setOpenComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy user ID từ localStorage
        const userInfo = localStorage.getItem('user_info');
        if (!userInfo) {
          setError('Vui lòng đăng nhập để xem profile');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userInfo);
        const userId = user.id;

        // Gọi API để lấy profile data
        const response = await api.get<ProfileResponse>(`/profile/${userId}`);
        setProfileData(response);
      } catch (err: unknown) {
        console.error('Error fetching profile:', err);
        setError('Không thể tải thông tin profile. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Helper functions
  const toggleOpenComments = (postId: number) => {
    setOpenComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleAddComment = (postId: number) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;
    
    // TODO: Implement add comment API call
    console.log('Adding comment:', comment, 'to post:', postId);
    
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleToggleLike = (postId: number) => {
    // TODO: Implement like/unlike API call
    console.log('Toggling like for post:', postId);
  };

  const handleShare = (postId: number) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', postId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">Không có dữ liệu profile</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileNavbar />
      <div className="max-w-7xl mx-auto">
      {/* Cover image */}
      <div className="rounded-xl overflow-hidden h-48 md:h-56 lg:h-64 w-full mb-6">
        <img
          src={profileData.user.profileImage || "/src/assets/default-avatar.png"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar: profile card */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-6 sticky top-4">
            <div className="flex flex-col items-center text-center">
              <img
                src={profileData.user.profileImage || "/src/assets/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow -mt-20 md:-mt-24 bg-white"
              />
              <h2 className="mt-4 text-xl font-semibold">{profileData.user.username}</h2>
              <p className="text-sm text-gray-500">{profileData.user.email}</p>
              
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profileData.user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  profileData.user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {profileData.user.role === 'admin' ? 'Admin' : 
                   profileData.user.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                </span>
              </div>
              
              {profileData.user.phoneNumber && (
                <p className="mt-3 text-sm text-gray-600">📞 {profileData.user.phoneNumber}</p>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                <p>Tham gia: {new Date(profileData.user.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>

              <div className="w-full mt-6">
                <button 
                  className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                >
                  Chỉnh sửa hồ sơ
                </button>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span>Đang học</span>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{profileData.posts.length}</div>
                  <div className="text-xs text-gray-500">Bài viết</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{profileData.images.length}</div>
                  <div className="text-xs text-gray-500">Hình ảnh</div>
                </div>
              </div>

              {/* Courses Section */}
              {profileData.courses.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Khóa học</h3>
                  <div className="space-y-2">
                    {profileData.courses.map((course) => (
                      <div key={course.id} className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-900">{course.courseName}</h4>
                        {course.description && (
                          <p className="text-xs text-gray-600 mt-1">{course.description}</p>
                        )}
                        {course.startDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Bắt đầu: {new Date(course.startDate).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                        {course.tuitionFee && (
                          <p className="text-xs text-blue-600 mt-1">
                            Học phí: {course.tuitionFee.toLocaleString('vi-VN')} VNĐ
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: tabs + posts/media */}
        <section className="lg:col-span-6">
          <div className="mb-3 inline-flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-sm ${activeTab === "posts" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
              aria-pressed={activeTab === "posts"}
            >
              Bài viết ({profileData.posts.length})
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-4 py-2 text-sm border-l border-gray-200 ${activeTab === "media" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
              aria-pressed={activeTab === "media"}
            >
              Ảnh & Video ({profileData.images.length})
            </button>
          </div>

          {/* Posts Tab */}
          {activeTab === "posts" ? (
            <div className="space-y-6">
              {profileData.posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Chưa có bài viết nào</p>
                </div>
              ) : (
                profileData.posts
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                        <img src={profileData.user.profileImage || "/src/assets/default-avatar.png"} alt="avt" className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-medium">{profileData.user.username}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{formatRelativeTime(new Date(post.createdAt).getTime(), now)}</span>
                            {post.updatedAt && post.updatedAt !== post.createdAt && <span>(đã chỉnh sửa)</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        {post.content && <p className="mb-4 whitespace-pre-wrap">{post.content}</p>}
                        
                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleLike(post.id)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 transition"
                            >
                              <span>🤍</span>
                              <span>Thích</span>
                            </button>

                            <button
                              onClick={() => toggleOpenComments(post.id)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 transition"
                            >
                              <span>💬</span>
                              <span>Bình luận</span>
                            </button>

                            <button
                              onClick={() => handleShare(post.id)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 transition"
                            >
                              <span>🔗</span>
                              <span>Chia sẻ</span>
                            </button>
                          </div>

                          <div className="text-gray-500">
                            <span className="mr-3">{post.reactions.length} lượt thích</span>
                            <span>{post.comments.length} bình luận</span>
                          </div>
                        </div>

                        {/* Comments */}
                        {openComments.includes(post.id) && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2">
                              <input
                                value={commentInputs[post.id] || ""}
                                onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddComment(post.id);
                                }}
                                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Viết bình luận..."
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Gửi
                              </button>
                            </div>

                            <ul className="mt-4 space-y-3">
                              {post.comments.map((c) => (
                                <li key={c.id} className="flex items-start gap-3">
                                  <img
                                    src={profileData.user.profileImage || "/src/assets/default-avatar.png"}
                                    alt="avt"
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-xs">{c.username}</span>
                                      <span className="text-xs text-gray-500">{formatRelativeTime(new Date(c.createdAt).getTime(), now)}</span>
                                    </div>
                                    <p className="leading-relaxed">{c.content}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          ) : (
            /* Media Tab */
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setMediaTypeFilter("all")}
                    className={`px-3 py-1.5 text-sm ${mediaTypeFilter === "all" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                    aria-pressed={mediaTypeFilter === "all"}
                  >Tất cả ({profileData.images.length})</button>
                  <button
                    onClick={() => setMediaTypeFilter("image")}
                    className={`px-3 py-1.5 text-sm border-l border-gray-200 ${mediaTypeFilter === "image" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                    aria-pressed={mediaTypeFilter === "image"}
                  >Ảnh ({profileData.images.length})</button>
                </div>
                <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setMediaSortOrder("desc")}
                    className={`px-3 py-1.5 text-sm ${mediaSortOrder === "desc" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                    aria-pressed={mediaSortOrder === "desc"}
                  >Mới nhất</button>
                  <button
                    onClick={() => setMediaSortOrder("asc")}
                    className={`px-3 py-1.5 text-sm border-l border-gray-200 ${mediaSortOrder === "asc" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                    aria-pressed={mediaSortOrder === "asc"}
                  >Cũ nhất</button>
                </div>
              </div>

              {profileData.images.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-6">Chưa có hình ảnh nào.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profileData.images
                    .filter(() => {
                      if (mediaTypeFilter === "all") return true;
                      if (mediaTypeFilter === "image") return true;
                      return false;
                    })
                    .sort((a, b) => {
                      const aTime = new Date(a.createdAt).getTime();
                      const bTime = new Date(b.createdAt).getTime();
                      return mediaSortOrder === "desc" ? bTime - aTime : aTime - bTime;
                    })
                    .map((img, idx) => (
                      <div
                        key={`${img.imageUrl}-${img.createdAt}-${idx}`}
                        className="group relative rounded-lg overflow-hidden border border-gray-200 h-40 bg-black flex items-center justify-center"
                      >
                        <img src={img.imageUrl} alt={`image-${idx}`} className="max-w-full max-h-full object-contain group-hover:opacity-90" />
                        {img.description && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition">
                            {img.description}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right: progress and badges */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="text-xl font-semibold mb-4">Progress</h4>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-4 bg-blue-600 w-[50%]"></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Scrum Essence: 50%</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="text-xl font-semibold mb-4">Badges</h4>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
}