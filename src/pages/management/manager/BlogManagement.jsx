import React, { useState, useEffect } from "react";
import { api } from "~/libs/api";

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/blogs?page=${currentPage}&limit=8`);
        const apiData = response.data;

        if (!apiData || !Array.isArray(apiData.data)) {
          throw new Error("Định dạng dữ liệu API không hợp lệ.");
        }

        const formattedPosts = apiData.data.map((post) => ({
          id: post._id,
          title: post.title,
          author: post.authorInfo.fullName,
          date: new Date(post.publishedAt).toISOString().split("T")[0],
          status: "Published", 
        }));

        setPosts(formattedPosts);
        setTotalPages(apiData.totalPages);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
    }
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) {
      return null;
    }

    return (
      <div className="mt-8 flex justify-center items-center gap-2">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <span className="text-gray-600">
          Trang {currentPage} / {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#4157ff]">Quản lý Blog</h1>
        <button
          type="button"
          className="bg-[#4157ff] hover:bg-[#3247d6] text-white px-5 py-2 rounded-md transition"
        >
          Thêm bài viết mới
        </button>
      </header>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Đang tải bài viết...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">Lỗi: {error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">{post.title}</h2>
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
          {renderPaginationControls()}
        </>
      )}
    </div>
  );
};

export default BlogManagement;