import { useState, useEffect } from "react";
import { api } from "~/libs/api";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [listIsLoading, setListIsLoading] = useState(true);
  const [loadMoreIsLoading, setLoadMoreIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState("listing");
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailIsLoading, setDetailIsLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('vi-VN', options).format(date).replace(' tháng', ' Tháng');
  };

  const fetchBlogList = async (pageNum) => {
    try {
      const response = await api.get(`/blogs?page=${pageNum}&limit=${4}&sort=-publishedAt`);
      const apiData = response.data;

      if (!apiData || !Array.isArray(apiData.data)) {
        throw new Error("Định dạng danh sách API không hợp lệ.");
      }
      
      const formattedPosts = apiData.data.map(post => ({
        id: post._id,
        title: post.title,
        excerpt: `Khám phá thêm về chủ đề "${post.title}" và các hướng dẫn chi tiết để bảo vệ sức khỏe học đường.`,
        date: formatDate(post.publishedAt),
        author: post.authorInfo.fullName,
        image: post.coverImageUrl,
      }));

      setBlogPosts(prevPosts => pageNum === 1 ? formattedPosts : [...prevPosts, ...formattedPosts]);
      
      // So sánh page hiện tại (đã chuyển sang số) với tổng số trang
      if (parseInt(apiData.page) >= apiData.totalPages) {
        setHasMore(false);
      }

    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra khi tải danh sách bài viết.");
    }
  };
  
  useEffect(() => {
    const initialLoad = async () => {
        setListIsLoading(true);
        await fetchBlogList(1);
        setListIsLoading(false);
    }
    initialLoad();
  }, []);

  const handleLoadMore = async () => {
      const nextPage = page + 1;
      setLoadMoreIsLoading(true);
      await fetchBlogList(nextPage);
      setPage(nextPage);
      setLoadMoreIsLoading(false);
  }

  const handlePostClick = async (postSummary) => {
    setCurrentPage("detail");
    setDetailIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/blogs/${postSummary.id}`);
      const detailData = response.data.data;
      
      const fullPostDetails = {
        ...postSummary,
        content: detailData.content,
        authorBio: detailData.authorInfo.bio || `Chuyên gia trong lĩnh vực y tế học đường.`,
      };
      
      setSelectedPost(fullPostDetails);
    } catch (err) {
      setError(err.message || `Không thể tải chi tiết bài viết.`);
      setCurrentPage("listing"); 
    } finally {
      setDetailIsLoading(false);
    }
  };

  const handleBackToListing = () => {
    setCurrentPage("listing");
    setSelectedPost(null);
    setError(null);
  };

  const BlogDetailPage = ({ post, isLoading, onBack }) => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại trang Blog
        </button>
      </div>
      {isLoading ? (
          <div className="text-center py-20">Đang tải chi tiết bài viết...</div>
      ) : post && (
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-4 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-none">
          <div className="text-xl text-gray-600 leading-relaxed font-light mb-8">
            {post.excerpt}
          </div>
          <div
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/<h2>/g, '<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">')
                .replace(/<p>/g, '<p class="mb-6">'),
            }}
          />
        </div>
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4 md:mr-6 md:mb-0 text-white mx-auto md:mx-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl mb-3 text-gray-900">Về {post.author}</h3>
              <p className="text-gray-600 leading-relaxed">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );

  const BlogListingPage = () => (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 lg:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}>
              Nghiên Cứu & Đổi Mới Y Tế Học Đường
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Khám phá những nghiên cứu đột phá, các phát hiện sáng tạo và tư duy dẫn đầu từ các giảng viên và nhà nghiên cứu danh tiếng của Đại học Y Dược TPHCM về lĩnh vực y tế học đường.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Các Bài Viết & Nghiên Cứu Mới Nhất
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Luôn cập nhật những phát triển mới nhất trong nghiên cứu, giáo dục và đổi mới đang diễn ra tại các khoa và viện của Đại học Y Dược TPHCM liên quan đến sức khỏe học đường.
          </p>
        </div>
        {error && <p className="text-center text-red-500 mb-8">Lỗi: {error}</p>}
        {listIsLoading ? (
          <div className="text-center">Đang tải danh sách bài viết...</div>
        ) : blogPosts.length > 0 ? (
          <>
            <div className="mb-16">
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => handlePostClick(blogPosts[0])}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0 aspect-video md:w-1/2 md:aspect-auto overflow-hidden">
                    <img src={blogPosts[0].image || "/placeholder.svg"} alt={blogPosts[0].title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="p-8 flex-1 md:w-1/2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight transition-colors hover:text-blue-600">
                      {blogPosts[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
                      <span className="font-medium">{blogPosts[0].author}</span>
                      <time>{blogPosts[0].date}</time>
                    </div>
                    <div className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                      <span>Đọc thêm</span>
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.slice(1).map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 transition-colors hover:text-blue-600">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="font-medium">{post.author}</span>
                      <time>{post.date}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadMoreIsLoading}
                  className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {loadMoreIsLoading ? 'Đang tải...' : 'Xem thêm bài viết'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">Không có bài viết nào.</div>
        )}
      </div>
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Luôn Kết Nối Với Nghiên Cứu Y Tế Học Đường
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận bản tin của chúng tôi để nhận những cập nhật mới nhất về các đột phá nghiên cứu, thành tựu học thuật và tin tức từ Đại học Y Dược TPHCM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Nhập địa chỉ email của bạn" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentPage === "detail") {
    return <BlogDetailPage post={selectedPost} isLoading={detailIsLoading} onBack={handleBackToListing} />;
  }

  return <BlogListingPage />;
}