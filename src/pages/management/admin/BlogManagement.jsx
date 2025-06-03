import React from "react";

const posts = [
  {
    id: 1,
    title: "Bài viết đầu tiên",
    author: "Kevin",
    date: "2025-06-01",
    status: "Published",
  },
  {
    id: 2,
    title: "Hướng dẫn React",
    author: "Dung",
    date: "2025-06-02",
    status: "Draft",
  },
  {
    id: 3,
    title: "Làm thế nào để học JavaScript hiệu quả",
    author: "Lan",
    date: "2025-05-30",
    status: "Published",
  },
  {
    id: 4,
    title: "Tối ưu hóa React app",
    author: "Minh",
    date: "2025-06-03",
    status: "Draft",
  },
];

const BlogManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#4157ff]">Quản lý Blog</h1>
        <button
          type="button"
          className="bg-[#4157ff] hover:bg-[#3247d6] text-white px-5 py-2 rounded-md transition"
        >
          Thêm bài viết mới
        </button>
      </header>

      {/* Grid bài viết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Tác giả:</span> {post.author}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Ngày đăng:</span> {post.date}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  post.status === "Published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.status}
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button className="text-[#4157ff] hover:underline text-sm font-medium">
                Sửa
              </button>
              <button className="text-red-500 hover:underline text-sm font-medium">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;
