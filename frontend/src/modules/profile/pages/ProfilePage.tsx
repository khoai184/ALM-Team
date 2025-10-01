import { useMemo, useState } from "react";

export default function ProfilePage() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(12);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [comments, setComments] = useState<Array<{ id: number; text: string }>>([
    { id: 1, text: "Bài này hay quá!" },
    { id: 2, text: "Ảnh đẹp nè 👏" },
  ]);

  const totalComments = useMemo(() => comments.length, [comments]);

  function handleToggleLike() {
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }

  function handleAddComment() {
    const text = commentInput.trim();
    if (!text) return;
    setComments((prev) => [{ id: Date.now(), text }, ...prev]);
    setCommentInput("");
    if (!isCommentOpen) setIsCommentOpen(true);
  }

  async function handleShare() {
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Đã sao chép liên kết bài viết!");
      } else {
        // Fallback
        prompt("Sao chép liên kết bài viết:", url);
      }
    } catch {
      alert("Không thể sao chép liên kết. Vui lòng thử lại.");
    }
  }
  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover image */}
      <div className="rounded-xl overflow-hidden h-48 md:h-56 lg:h-64 w-full mb-6">
        <img
          src="/src/assets/backgroundwelcome.jpg"
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
                src="/src/assets/codegym.png"
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow -mt-20 md:-mt-24 bg-white"
              />
              <h2 className="mt-4 text-xl font-semibold">Nguyễn Văn Demo</h2>
              <p className="text-sm text-gray-500">CodeGym Software</p>

              <div className="w-full mt-6 space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                  <span>📷</span>
                  <span>Tải ảnh đại diện</span>
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                  <span>🖼️</span>
                  <span>Ảnh cá nhân</span>
                </button>
                <button className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
                  Chỉnh sửa hồ sơ
                </button>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span>Đang học</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: posts */}
        <section className="lg:col-span-6">
          <h3 className="text-2xl font-semibold mb-2">Posts</h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <img src="/src/assets/codegym.png" alt="avt" className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium">Nguyễn Văn Demo</div>
                <div className="text-xs text-gray-500">59m ago</div>
              </div>
            </div>
            <div className="p-5">
              <p className="mb-4">Omgg!! What is thatt !??</p>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1400&auto=format&fit=crop"
                  alt="post"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Actions */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleLike}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span>{isLiked ? "❤️" : "🤍"}</span>
                    <span>Thích</span>
                  </button>

                  <button
                    onClick={() => setIsCommentOpen((v) => !v)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 transition"
                  >
                    <span>💬</span>
                    <span>Bình luận</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 transition"
                  >
                    <span>🔗</span>
                    <span>Chia sẻ</span>
                  </button>
                </div>

                <div className="text-gray-500">
                  <span className="mr-3">{likeCount} lượt thích</span>
                  <span>{totalComments} bình luận</span>
                </div>
              </div>

              {/* Comments */}
              {isCommentOpen && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment();
                      }}
                      className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Viết bình luận..."
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Gửi
                    </button>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {comments.map((c) => (
                      <li key={c.id} className="flex items-start gap-3">
                        <img
                          src="/src/assets/codegym.png"
                          alt="avt"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1">
                          <p className="leading-relaxed">{c.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right: progress and badges */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="text-xl font-semibold mb-4">Progress</h4>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-4 bg-blue-600 w-4/5"></div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Scrum Essence: 83%</p>
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
  );
}
