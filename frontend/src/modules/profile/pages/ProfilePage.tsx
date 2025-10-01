import { useEffect, useMemo, useState } from "react";

type MediaItem = { url: string; type: "image" | "video" };
type CommentItem = { id: number; text: string };
type Post = {
  id: number;
  authorName: string;
  avatar: string;
  text: string;
  media: MediaItem[];
  createdAt: number;
  editedAt?: number;
  likeCount: number;
  isLiked: boolean;
  comments: CommentItem[];
  pinned?: boolean;
};

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

  // Composer state
  const [composerText, setComposerText] = useState<string>("");
  // Keep a reference to revoke object URLs later if needed
  const [, setComposerFiles] = useState<File[]>([]);
  const [composerPreviews, setComposerPreviews] = useState<MediaItem[]>([]);

  // Feed state (session-only)
  const [posts, setPosts] = useState<Post[]>([{
    id: 1,
    authorName: "Nguyễn Văn Demo",
    avatar: "/src/assets/default-avatar.png",
    text: "Omgg!! What is thatt !??",
    media: [
      { url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1400&auto=format&fit=crop", type: "image" },
    ],
    createdAt: Date.now() - 12 * 60 * 1000, 
    likeCount: 12,
    isLiked: false,
    comments: [
      { id: 1001, text: "Bài này hay quá!" },
      { id: 1002, text: "Ảnh đẹp nè 👏" },
    ],
    pinned: false,
  }]);

  // UI state per-post
  const [openComments, setOpenComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [mediaModalOpen, setMediaModalOpen] = useState<boolean>(false);
  const [modalMediaItems, setModalMediaItems] = useState<MediaItem[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video">("all");
  const [mediaSortOrder, setMediaSortOrder] = useState<"desc" | "asc">("desc");

  const totalPosts = useMemo(() => posts.length, [posts]);

  function toggleOpenComments(postId: number) {
    setOpenComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [postId, ...prev]
    );
  }

  function handleToggleLike(postId: number) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isLiked = !p.isLiked;
        const likeCount = isLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1);
        return { ...p, isLiked, likeCount };
      })
    );
  }

  function handleAddComment(postId: number) {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [{ id: Date.now(), text }, ...p.comments] } : p))
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setOpenComments((prev) => (prev.includes(postId) ? prev : [postId, ...prev]));
  }

  async function handleShare(_postId: number) {
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Đã sao chép liên kết bài viết!");
      } else {
        prompt("Sao chép liên kết bài viết:", url);
      }
    } catch {
      alert("Không thể sao chép liên kết. Vui lòng thử lại.");
    }
  }

  function handleFilesChange(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files);
    setComposerFiles(list);
    const previews: MediaItem[] = list.map((f) => {
      const url = URL.createObjectURL(f);
      const type: MediaItem["type"] = f.type.startsWith("video") ? "video" : "image";
      return { url, type };
    });
    setComposerPreviews(previews);
  }

  function handleCreatePost() {
    const text = composerText.trim();
    if (!text && composerPreviews.length === 0) return;
    const newPost: Post = {
      id: Date.now(),
      authorName: "Nguyễn Văn Demo",
      avatar: "/src/assets/default-avatar.png",
      text,
      media: composerPreviews,
      createdAt: Date.now(),
      editedAt: undefined,
      likeCount: 0,
      isLiked: false,
      comments: [],
      pinned: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposerText("");
    setComposerFiles([]);
    setComposerPreviews([]);
  }

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("profile_posts");
      if (raw) {
        const parsed = JSON.parse(raw) as Post[];
        if (Array.isArray(parsed)) setPosts(parsed);
      }
    } catch {}
  }, []);

  // Persist to sessionStorage on changes (skip blob media URLs)
  useEffect(() => {
    try {
      const serializable = posts.map((p) => ({
        ...p,
        media: p.media.filter((m) => !m.url.startsWith("blob:")),
      }));
      sessionStorage.setItem("profile_posts", JSON.stringify(serializable));
    } catch {}
  }, [posts]);

  function handleTogglePin(postId: number) {
    setPosts((prev) => {
      const pinnedCount = prev.filter((p) => p.pinned).length;
      return prev.map((p) => {
        if (p.id !== postId) return p;
        const nextPinned = !p.pinned;
        if (nextPinned && pinnedCount >= 2) {
          alert("Bạn chỉ có thể ghim tối đa 2 bài viết.");
          return p;
        }
        return { ...p, pinned: nextPinned };
      });
    });
  }

  function handleStartEdit(postId: number) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    setEditingPostId(postId);
    setEditingText(post.text);
  }

  function handleCancelEdit() {
    setEditingPostId(null);
    setEditingText("");
  }

  function handleSaveEdit(postId: number) {
    const text = editingText.trim();
    if (!text) return handleCancelEdit();
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, text, editedAt: Date.now() } : p)));
    handleCancelEdit();
  }

  function handleDelete(postId: number) {
    const ok = confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!ok) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  // Media library derived from posts, carrying createdAt for sorting
  type MediaWithMeta = MediaItem & { createdAt: number };
  const mediaLibrary: MediaWithMeta[] = useMemo(
    () => posts.flatMap((p) => p.media.map((m) => ({ ...m, createdAt: p.createdAt }))),
    [posts]
  );

  const filteredSortedMedia: MediaWithMeta[] = useMemo(() => {
    let list = mediaLibrary;
    if (mediaTypeFilter !== "all") {
      list = list.filter((m) => m.type === mediaTypeFilter);
    }
    list = [...list].sort((a, b) => (mediaSortOrder === "desc" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    return list;
  }, [mediaLibrary, mediaTypeFilter, mediaSortOrder]);

  // Modal thumbnail window state
  const [modalThumbStart, setModalThumbStart] = useState<number>(0);
  const MODAL_VISIBLE = 10;

  // Profile edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn Demo",
    company: "CodeGym Software",
    bio: "",
    location: "",
    website: "",
    avatar: "/src/assets/default-avatar.png",
    cover: "/src/assets/backgroundwelcome.jpg",
  });
  const [editForm, setEditForm] = useState(profileData);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  function openEditModal() {
    setEditForm(profileData);
    setAvatarPreview("");
    setCoverPreview("");
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setAvatarPreview("");
    setCoverPreview("");
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  function saveProfile() {
    const newData = {
      ...editForm,
      avatar: avatarPreview || profileData.avatar,
      cover: coverPreview || profileData.cover,
    };
    setProfileData(newData);
    closeEditModal();
  }

  function openMediaModal(items: MediaItem[], index: number) {
    setModalMediaItems(items);
    setModalIndex(index);
    setMediaModalOpen(true);
  }

  function closeMediaModal() {
    setMediaModalOpen(false);
  }

  function nextMedia() {
    setModalIndex((i) => (i + 1) % modalMediaItems.length);
  }

  function prevMedia() {
    setModalIndex((i) => (i - 1 + modalMediaItems.length) % modalMediaItems.length);
  }

  function downloadCurrentMedia() {
    const current = modalMediaItems[modalIndex];
    if (!current) return;
    const link = document.createElement("a");
    link.href = current.url;
    link.download = `media-${modalIndex + 1}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Keyboard shortcuts for modal: Esc to close, ArrowLeft/Right to navigate
  useEffect(() => {
    if (!mediaModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (!mediaModalOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeMediaModal();
      } else if (e.key === "ArrowLeft" && modalMediaItems.length > 0) {
        e.preventDefault();
        prevMedia();
      } else if (e.key === "ArrowRight" && modalMediaItems.length > 0) {
        e.preventDefault();
        nextMedia();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mediaModalOpen, modalMediaItems.length]);
  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover image */}
      <div className="rounded-xl overflow-hidden h-48 md:h-56 lg:h-64 w-full mb-6">
        <img
          src={profileData.cover}
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
                src={profileData.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow -mt-20 md:-mt-24 bg-white"
              />
              <h2 className="mt-4 text-xl font-semibold">{profileData.name}</h2>
              <p className="text-sm text-gray-500">{profileData.company}</p>
              
              {profileData.bio && (
                <p className="mt-3 text-sm text-gray-600 text-center">{profileData.bio}</p>
              )}
              
              {(profileData.location || profileData.website) && (
                <div className="mt-3 space-y-1">
                  {profileData.location && (
                    <p className="text-xs text-gray-500">📍 {profileData.location}</p>
                  )}
                  {profileData.website && (
                    <a 
                      href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline block"
                    >
                      🌐 {profileData.website}
                    </a>
                  )}
                </div>
              )}

              <div className="w-full mt-6">
                <button 
                  onClick={openEditModal}
                  className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                >
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

        {/* Center: tabs + composer + posts/media */}
        <section className="lg:col-span-6">
          <div className="mb-3 inline-flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-sm ${activeTab === "posts" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
              aria-pressed={activeTab === "posts"}
            >
              Bài viết
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-4 py-2 text-sm border-l border-gray-200 ${activeTab === "media" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
              aria-pressed={activeTab === "media"}
            >
              Ảnh & Video
            </button>
          </div>

          {/* Composer (only in Posts tab) */}
          {activeTab === "posts" && (
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <div className="flex items-start gap-3">
              <img src={profileData.avatar} alt="me" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Bạn đang nghĩ gì?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  aria-label="Nội dung bài viết"
                />
                {composerPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {composerPreviews.map((m, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 h-40 bg-black flex items-center justify-center">
                        {m.type === "image" ? (
                          <img src={m.url} alt="preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <video src={m.url} controls className="max-w-full max-h-full object-contain" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white border-gray-200 hover:bg-gray-50 text-sm cursor-pointer" aria-label="Đính kèm ảnh hoặc video">
                      <span>🖼️</span>
                      <span>Ảnh/Video</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => handleFilesChange(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={composerText.trim().length === 0 && composerPreviews.length === 0}
                    className={`px-4 py-2 text-sm rounded-md text-white ${
                      composerText.trim().length === 0 && composerPreviews.length === 0
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Feed or Media Library */}
          {activeTab === "posts" ? (
          <div className="space-y-6">
            {[...posts]
              .sort((a, b) => (a.pinned === b.pinned ? b.createdAt - a.createdAt : Number(b.pinned) - Number(a.pinned)))
              .map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                  <img src={profileData.avatar} alt="avt" className="w-10 h-10 rounded-full" />
              <div>
                    <div className="font-medium">{profileData.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{formatRelativeTime(post.createdAt, now)}</span>
                      {post.editedAt && <span>(đã chỉnh sửa)</span>}
                      {post.pinned && <span className="inline-flex items-center gap-1 text-amber-600">📌 Pinned</span>}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(post.id)}
                      className="text-xs px-2 py-1 rounded-md border bg-white border-gray-200 hover:bg-gray-50"
                    >
                      {post.pinned ? "Bỏ ghim" : "Ghim"}
                    </button>
                    {editingPostId === post.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs px-2 py-1 rounded-md border bg-white border-gray-200 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(post.id)}
                          className="text-xs px-2 py-1 rounded-md border bg-white border-gray-200 hover:bg-gray-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-xs px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Xóa
                        </button>
                      </>
                    )}
              </div>
            </div>
            <div className="p-5">
                  {editingPostId === post.id ? (
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                  ) : (
                    post.text && <p className="mb-4 whitespace-pre-wrap">{post.text}</p>
                  )}
                  {post.media.length > 0 && (() => {
                    const total = post.media.length;
                    if (total === 1) {
                      const m = post.media[0];
                      return (
                        <button
                          onClick={() => openMediaModal(post.media, 0)}
                          className="relative rounded-lg overflow-hidden h-96 w-full bg-black flex items-center justify-center"
                          aria-label="Xem media 1"
                        >
                          {m.type === "image" ? (
                            <img src={m.url} alt="post-0" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <video src={m.url} controls className="max-w-full max-h-full object-contain" />
                          )}
                        </button>
                      );
                    }

                    if (total === 2) {
                      return (
                        <div className="grid grid-cols-2 gap-2">
                          {post.media.slice(0, 2).map((m, idx) => (
                            <button
                              key={`${m.url}-${idx}`}
                              onClick={() => openMediaModal(post.media, idx)}
                              className="relative rounded-lg overflow-hidden h-80 bg-black flex items-center justify-center"
                              aria-label={`Xem media ${idx + 1}`}
                            >
                              {m.type === "image" ? (
                                <img src={m.url} alt={`post-${idx}`} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <video src={m.url} controls className="max-w-full max-h-full object-contain" />
                              )}
                            </button>
                          ))}
                        </div>
                      );
                    }

                    // total >= 3 => collage style: big left (row-span-2, col-span-2) + right 2x2 (up to 4). If more than 5, overlay +N on last.
                    const toShow = Math.min(total, 5);
                    return (
                      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-96">
                        {/* Big tile */}
                        <button
                          onClick={() => openMediaModal(post.media, 0)}
                          className="relative col-span-2 row-span-2 rounded-lg overflow-hidden bg-black flex items-center justify-center"
                          aria-label="Xem media 1"
                        >
                          {post.media[0].type === "image" ? (
                            <img src={post.media[0].url} alt="post-0" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <video src={post.media[0].url} controls className="max-w-full max-h-full object-contain" />
                          )}
                        </button>

                        {/* Right 2x2 tiles */}
                        {post.media.slice(1, toShow).map((m, i) => {
                          const actualIndex = i + 1; // because we sliced from 1
                          const isLastOverlay = actualIndex === toShow - 1 && total > toShow;
                          return (
                            <button
                              key={`${m.url}-${actualIndex}`}
                              onClick={() => openMediaModal(post.media, actualIndex)}
                              className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center"
                              aria-label={`Xem media ${actualIndex + 1}`}
                            >
                              {m.type === "image" ? (
                                <img src={m.url} alt={`post-${actualIndex}`} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <video src={m.url} controls className="max-w-full max-h-full object-contain" />
                              )}
                              {isLastOverlay && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white text-2xl font-semibold">+{total - toShow}</span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition ${
                          post.isLiked
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span>{post.isLiked ? "❤️" : "🤍"}</span>
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
                      <span className="mr-3">{post.likeCount} lượt thích</span>
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
                              src={profileData.avatar}
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
            ))}
            {totalPosts === 0 && (
              <div className="text-sm text-gray-500 text-center py-6">Chưa có bài viết nào.</div>
            )}
          </div>
          ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setMediaTypeFilter("all")}
                  className={`px-3 py-1.5 text-sm ${mediaTypeFilter === "all" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                  aria-pressed={mediaTypeFilter === "all"}
                >Tất cả</button>
                <button
                  onClick={() => setMediaTypeFilter("image")}
                  className={`px-3 py-1.5 text-sm border-l border-gray-200 ${mediaTypeFilter === "image" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                  aria-pressed={mediaTypeFilter === "image"}
                >Ảnh</button>
                <button
                  onClick={() => setMediaTypeFilter("video")}
                  className={`px-3 py-1.5 text-sm border-l border-gray-200 ${mediaTypeFilter === "video" ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
                  aria-pressed={mediaTypeFilter === "video"}
                >Video</button>
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

            {filteredSortedMedia.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-6">Chưa có media nào.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredSortedMedia.map((m, idx) => (
                  <button
                    key={`${m.url}-${m.createdAt}-${idx}`}
                    onClick={() => openMediaModal(filteredSortedMedia.map(({ url, type }) => ({ url, type })), idx)}
                    className="group relative rounded-lg overflow-hidden border border-gray-200 h-40 bg-black flex items-center justify-center"
                    aria-label="Mở media"
                  >
                    {m.type === "image" ? (
                      <img src={m.url} alt={`media-${idx}`} className="max-w-full max-h-full object-contain group-hover:opacity-90" />
                    ) : (
                      <video src={m.url} className="max-w-full max-h-full object-contain" />
                    )}
                  </button>
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

      {/* Media Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeMediaModal}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeMediaModal}
              className="absolute -top-10 right-0 text-white text-xl"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="bg-black rounded-lg overflow-hidden h-[70vh] flex items-center justify-center">
              {modalMediaItems[modalIndex]?.type === "image" ? (
                <img src={modalMediaItems[modalIndex]?.url} alt="media" className="max-w-full max-h-full object-contain" />
              ) : (
                <video src={modalMediaItems[modalIndex]?.url} controls autoPlay className="max-w-full max-h-full object-contain" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button onClick={prevMedia} className="px-3 py-2 bg-white/10 rounded hover:bg-white/20">Trước</button>
                <button onClick={nextMedia} className="px-3 py-2 bg-white/10 rounded hover:bg-white/20">Sau</button>
              </div>
              <div className="flex items-center gap-2">
                <a href={modalMediaItems[modalIndex]?.url} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white/10 rounded hover:bg-white/20">Mở tab</a>
                <button onClick={downloadCurrentMedia} className="px-3 py-2 bg-white/10 rounded hover:bg-white/20">Tải xuống</button>
                <span className="text-sm">{modalIndex + 1} / {modalMediaItems.length}</span>
              </div>
            </div>

            {modalMediaItems.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalThumbStart((s) => Math.max(0, s - 1))}
                    className="px-2 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                    disabled={modalThumbStart === 0}
                    aria-label="Lùi trái danh sách"
                  >
                    ◀
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-2">
                      {modalMediaItems
                        .slice(modalThumbStart, modalThumbStart + MODAL_VISIBLE)
                        .map((m, i) => {
                          const actualIndex = modalThumbStart + i;
                          return (
                            <button
                              key={`${m.url}-${actualIndex}`}
                              onClick={() => setModalIndex(actualIndex)}
                              className={`h-16 w-16 rounded overflow-hidden border shrink-0 ${
                                actualIndex === modalIndex ? "border-blue-400" : "border-gray-600"
                              }`}
                              aria-label={`Xem media ${actualIndex + 1}`}
                            >
                              {m.type === "image" ? (
                                <img src={m.url} alt={`thumb-${actualIndex}`} className="w-full h-full object-cover" />
                              ) : (
                                <video src={m.url} className="w-full h-full object-cover" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                  <button
                    onClick={() => setModalThumbStart((s) => (s + MODAL_VISIBLE < modalMediaItems.length ? s + 1 : s))}
                    className="px-2 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                    disabled={modalThumbStart + MODAL_VISIBLE >= modalMediaItems.length}
                    aria-label="Tiến phải danh sách"
                  >
                    ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeEditModal}>
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Chỉnh sửa hồ sơ</h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Cover Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa</label>
                  <div className="relative">
                    <img
                      src={coverPreview || profileData.cover}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer"
                    >
                      <span className="text-white text-sm">Thay đổi ảnh bìa</span>
                    </label>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarPreview || profileData.avatar}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <span>📷</span>
                        <span>Chọn ảnh</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Viết vài dòng về bản thân..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
