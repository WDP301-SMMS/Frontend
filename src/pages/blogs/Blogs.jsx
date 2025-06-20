"use client";

import { useState } from "react";

export default function BlogPage() {
  // Sample blog post data - adjusted for School Health theme
  const [blogPosts] = useState([
    {
      id: 1,
      title: "Nâng Cao Sức Khỏe Tâm Thần Học Đường: Nghiên Cứu Mới từ ĐH Y Dược TPHCM",
      excerpt: "Các nhà nghiên cứu tại Đại học Y Dược TPHCM đang tiên phong trong các phương pháp mới để hỗ trợ sức khỏe tâm thần cho học sinh. Công trình đột phá này hứa hẹn định hình tương lai của y tế học đường.",
      content: "<p>Đại học Y Dược TPHCM tiếp tục dẫn đầu trong nghiên cứu y tế học đường, với những khám phá đột phá đang định hình lại sự hiểu biết và hỗ trợ của chúng ta về hạnh phúc của học sinh. Cách tiếp cận liên ngành của chúng tôi tập hợp các chuyên gia từ tâm thần học, nhi khoa, xã hội học và giáo dục để giải quyết các vấn đề thách thức nhất trong y tế học đường.</p><h2>Chương Trình Can Thiệp Tâm Lý Đột Phá</h2><p>Các nhóm nghiên cứu của chúng tôi đã phát triển các chương trình can thiệp tâm lý mới lạ chứng minh hiệu quả chưa từng có trong việc giảm căng thẳng, lo âu và trầm cảm ở học sinh. Những đổi mới này không chỉ là những bài tập học thuật—chúng có những ứng dụng thực tế đã và đang được triển khai tại các trường học.</p><h2>Phát Triển Y Tế Học Đường Có Trách Nhiệm</h2><p>Cam kết của Đại học Y Dược TPHCM đối với sự phát triển y tế học đường có trách nhiệm đảm bảo rằng nghiên cứu của chúng tôi xem xét những tác động rộng lớn hơn của y tế học đường đối với xã hội. Chúng tôi đang phát triển các khuôn khổ cho y tế học đường đạo đức, ưu tiên sự công bằng, minh bạch và phúc lợi của học sinh.</p><h2>Hướng Phát Triển Tương Lai</h2><p>Nhìn về phía trước, nghiên cứu của chúng tôi sẽ tập trung vào việc tạo ra các hệ thống hỗ trợ sức khỏe tâm thần có thể học hỏi hiệu quả hơn, lý giải các vấn đề phức tạp và cộng tác hiệu quả với các trường học. Tương lai của y tế học đường rất tươi sáng, và Đại học Y Dược TPHCM đang dẫn đầu.</p>",
      date: "15 Tháng 12, 2024",
      author: "TS. Nguyễn Thị Thu Hà",
      authorBio: "TS. Nguyễn Thị Thu Hà là Trưởng khoa Y tế Công cộng tại Đại học Y Dược TPHCM, chuyên về sức khỏe tâm thần học đường. Bà đã công bố hơn 50 bài báo và dẫn đầu Sáng kiến Đạo đức Y tế Học đường.",
      category: "Sức Khỏe Tâm Thần",
      image: "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/10/5/base64-17281100442951974649453.jpeg",
      readTime: "8 phút đọc",
    },
    {
      id: 2,
      title: "Giải Pháp Dinh Dưỡng Bền Vững cho Trường Học Thế Kỷ 21",
      excerpt: "Các nhóm nghiên cứu của chúng tôi đang phát triển các công nghệ dinh dưỡng sáng tạo có thể thay đổi cơ sở hạ tầng thực phẩm trường học toàn cầu. Từ những đổi mới trong bữa ăn học đường đến các giải pháp bảo quản thực phẩm đột phá, Đại học Y Dược TPHCM đang dẫn đầu.",
      content: "<p>Chuyển đổi sang dinh dưỡng bền vững là một trong những thách thức quan trọng nhất trong thời đại của chúng ta. Các nhóm nghiên cứu của Đại học Y Dược TPHCM đang đi đầu trong việc phát triển các giải pháp sáng tạo hứa hẹn sẽ thay đổi cách chúng ta sản xuất, lưu trữ và phân phối thực phẩm trong môi trường học đường.</p><h2>Công Nghệ Bữa Ăn Học Đường Thế Hệ Mới</h2><p>Các nhà nghiên cứu của chúng tôi đã đạt được tỷ lệ hiệu quả đột phá trong việc tối ưu hóa thành phần bữa ăn học đường, có khả năng làm cho thực phẩm bổ dưỡng trở nên phải chăng và dễ tiếp cận hơn bao giờ hết. Những tiến bộ này có thể cách mạng hóa ngành công nghiệp thực phẩm học đường.</p><h2>Bảo Quản Thực Phẩm Tiên Tiến</h2><p>Nghiên cứu dinh dưỡng của Đại học Y Dược TPHCM tập trung vào việc phát triển các giải pháp bảo quản thực phẩm an toàn hơn, hiệu quả hơn và bền lâu hơn. Công trình của chúng tôi về các hệ thống quản lý thực phẩm tiên tiến có thể cho phép áp dụng rộng rãi các chương trình bữa ăn lành mạnh và giảm lãng phí thực phẩm.</p>",
      date: "12 Tháng 12, 2024",
      author: "PGS.TS. Lê Văn Hùng",
      authorBio: "PGS.TS. Lê Văn Hùng dẫn đầu Sáng kiến Dinh dưỡng Bền vững tại Đại học Y Dược TPHCM, và đóng vai trò quan trọng trong việc phát triển các công nghệ dinh dưỡng học đường thế hệ mới.",
      category: "Dinh Dưỡng Học Đường",
      image: "https://cdn.nhandan.vn/images/7981b22431e151580ca63764f1bdbd8b617c91e62f8f5479a738d7b784cc313f41741c1de692138f8182e84adb16fc2e/tr1-so-23.jpg",
      readTime: "6 phút đọc",
    },
    {
      id: 3,
      title: "Tương Lai Giáo Dục Y Tế: Thực Tế Ảo Trong Đào Tạo Chăm Sóc Sức Khỏe Học Đường",
      excerpt: "Đại học Y Dược TPHCM giới thiệu công nghệ VR tiên tiến để nâng cao đào tạo y tế, cung cấp cho sinh viên những trải nghiệm học tập nhập vai, kết nối lý thuyết và thực hành trong chăm sóc sức khỏe học đường.",
      content: "<p>Giáo dục y tế đang trải qua một sự chuyển đổi mang tính cách mạng với sự tích hợp của công nghệ thực tế ảo. Đại học Y Dược TPHCM đang tiên phong trong việc sử dụng VR để tạo ra các trải nghiệm học tập nhập vai, chuẩn bị cho thế hệ chuyên gia chăm sóc sức khỏe tiếp theo cho môi trường trường học.</p><h2>Đào Tạo Chăm Sóc Sức Khỏe Học Đường Nhập Vai</h2><p>Các mô phỏng chăm sóc sức khỏe học đường VR của chúng tôi cho phép sinh viên thực hành các quy trình phức tạp trong một môi trường không rủi ro, xây dựng sự tự tin và kỹ năng trước khi tham gia vào các tình huống thực tế.</p><h2>Các Kịch Bản Tương Tác Với Học Sinh</h2><p>Công nghệ VR cho phép sinh viên thực hành tương tác với học sinh và phát triển sự đồng cảm thông qua các kịch bản thực tế mà khó có thể tái tạo trong đào tạo truyền thống.</p>",
      date: "10 Tháng 12, 2024",
      author: "TS. Phạm Thị Mai",
      authorBio: "TS. Phạm Thị Mai là Giám đốc Đổi mới Giáo dục Y tế tại Đại học Y Dược TPHCM, tập trung vào việc tích hợp công nghệ vào đào tạo chăm sóc sức khỏe học đường.",
      category: "Giáo Dục Y Tế",
      image: "https://vr360.com.vn/uploads/images/thuc-te-ao-trong-giao-duc-dai-hoc-2.png",
      readTime: "5 phút đọc",
    },
    {
      id: 4,
      title: "Y Tế Học Đường Kỹ Thuật Số: Bảo Tồn Di Sản Sức Khỏe Cộng Đồng Bằng Công Nghệ",
      excerpt: "Khám phá cách các công cụ và phương pháp kỹ thuật số đang cách mạng hóa nghiên cứu y tế học đường, từ phân tích dữ liệu sức khỏe học sinh đến các trải nghiệm y tế học đường ảo giúp sức khỏe dễ tiếp cận trên toàn thế giới.",
      content: "<p>Y tế học đường kỹ thuật số thể hiện sự giao thoa hấp dẫn giữa công nghệ và điều tra sức khỏe truyền thống trong môi trường giáo dục. Các sáng kiến y tế học đường kỹ thuật số của Đại học Y Dược TPHCM đang bảo tồn di sản sức khỏe cộng đồng và làm cho nó dễ tiếp cận với khán giả toàn cầu.</p><h2>Phân Tích Dữ Liệu Sức Khỏe Học Sinh</h2><p>Sử dụng các thuật toán học máy, chúng tôi đang khám phá những hiểu biết mới từ dữ liệu và hồ sơ sức khỏe học sinh, tiết lộ các mô hình và kết nối mà trước đây không thể nhìn thấy đối với các học giả con người.</p><h2>Trải Nghiệm Y Tế Học Đường Ảo</h2><p>Các dự án y tế học đường ảo của chúng tôi cho phép mọi người trên toàn thế giới trải nghiệm những hiểu biết về sức khỏe và thông tin y tế lịch sử một cách chi tiết chưa từng có, dân chủ hóa quyền truy cập vào di sản sức khỏe cộng đồng.</p>",
      date: "08 Tháng 12, 2024",
      author: "TS. Trần Minh Đức",
      authorBio: "TS. Trần Minh Đức là Giám đốc Phòng thí nghiệm Y tế Học đường Kỹ thuật số tại Đại học Y Dược TPHCM, chuyên về các phương pháp tiếp cận tính toán để phân tích y tế học đường.",
      category: "Y Tế Kỹ Thuật Số",
      image: "https://hnm.1cdn.vn/2022/09/05/hanoimoi.com.vn-uploads-images-tuandiep-2022-09-05-_hoi-chu-thap-do-thanh-pho-ha-noi-phoi-hop-voi-cac-co-so-y-te-to-chuc-tu-van-kham-suc-khoe-cho-nguoi-dan-tren-dia-ban-huyen-soc-son..jpg",
      readTime: "7 phút đọc",
    },
    {
      id: 5,
      title: "Nghiên Cứu Sức Khỏe Môi Trường Học Đường: Những Hiểu Biết Mới từ Khoa Y Tế Công Cộng",
      excerpt: "Những phát hiện gần đây từ các nhóm nghiên cứu sức khỏe môi trường học đường của chúng tôi tiết lộ các mô hình quan trọng trong xu hướng sức khỏe cộng đồng toàn cầu, đưa ra những quan điểm mới về thách thức môi trường trong môi trường giáo dục và các giải pháp tiềm năng.",
      content: "<p>Khoa Y tế Công cộng tại Đại học Y Dược TPHCM tiếp tục cung cấp những hiểu biết quan trọng về sức khỏe môi trường học đường, sử dụng các kỹ thuật mô hình hóa tiên tiến và nghiên cứu thực địa để hiểu môi trường giáo dục đang thay đổi của chúng ta.</p><h2>Mô Hình Hóa Môi Trường Học Đường Tiên Tiến</h2><p>Các nhà nghiên cứu của chúng tôi đã phát triển các mô hình môi trường học đường tinh vi cung cấp dự đoán chính xác hơn về các kịch bản sức khỏe trong tương lai, giúp các nhà hoạch định chính sách đưa ra quyết định sáng suốt cho môi trường trường học.</p><h2>Tương Tác Giữa Học Sinh và Môi Trường</h2><p>Nghiên cứu mới tiết lộ những tương tác phức tạp giữa hành vi của học sinh và các yếu tố môi trường, cung cấp những hiểu biết sâu sắc về cách các hệ thống y tế học đường phản ứng với các điều kiện thay đổi.</p>",
      date: "05 Tháng 12, 2024",
      author: "TS. Đỗ Thị Thanh",
      authorBio: "TS. Đỗ Thị Thanh là nhà khoa học sức khỏe môi trường hàng đầu tại Đại học Y Dược TPHCM, chuyên về tương tác giữa học sinh và môi trường cũng như mô hình hóa môi trường học đường.",
      category: "Sức Khỏe Môi Trường",
      image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/2/10/cham-soc-suc-khoe-h0c-duong-giai-doan-2021-2025-toan-dein-ca-the-chat-va-tinh-than-10-16444942939681106351987.jpg",
      readTime: "9 phút đọc",
    },
    {
      id: 6,
      title: "Đổi Mới Trong Giáo Dục Sức Khỏe Học Đường",
      excerpt: "Khoa Y tế Công cộng tại Đại học Y Dược TPHCM công bố các phương pháp sư phạm mới giúp giáo dục sức khỏe dễ tiếp cận và hấp dẫn hơn cho học sinh từ các nền tảng khác nhau.",
      content: "<p>Giáo dục sức khỏe học đường đang phát triển để đáp ứng nhu cầu của một lượng học sinh ngày càng đa dạng. Khoa Y tế Công cộng tại Đại học Y Dược TPHCM đang tiên phong trong các phương pháp tiếp cận mới để làm cho giáo dục sức khỏe dễ tiếp cận và hấp dẫn hơn.</p><h2>Thiết Kế Chương Trình Giảng Dạy Bao Trùm</h2><p>Chương trình giảng dạy mới của chúng tôi nhấn mạnh các ứng dụng trong thế giới thực và học tập hợp tác, giúp học sinh từ mọi nền tảng thành công trong giáo dục sức khỏe học đường.</p><h2>Nền Tảng Học Tập Tương Tác</h2><p>Chúng tôi đã phát triển các nền tảng trực tuyến sáng tạo cung cấp trải nghiệm học tập cá nhân hóa, thích ứng với tốc độ và phong cách học tập của mỗi học sinh.</p>",
      date: "03 Tháng 12, 2024",
      author: "PGS.TS. Hoàng Thị Lan",
      authorBio: "PGS.TS. Hoàng Thị Lan dẫn đầu đổi mới giáo dục tại Khoa Y tế Công cộng tại Đại học Y Dược TPHCM, tập trung vào giáo dục sức khỏe học đường bao trùm và dễ tiếp cận.",
      category: "Giáo Dục Sức Khỏe",
      image: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2024/09/07/thuc-hien-chuong-trinh-suc-khoe-hoc-duong.jpg",
      readTime: "4 phút đọc",
    },
  ]);

  const [currentPage, setCurrentPage] = useState("listing");
  const [selectedPost, setSelectedPost] = useState(null);

  const getCategoryStyles = (category) => {
    const styles = {
      "Sức Khỏe Tâm Thần": "bg-blue-100 text-blue-800",
      "Dinh Dưỡng Học Đường": "bg-green-100 text-green-800",
      "Giáo Dục Y Tế": "bg-purple-100 text-purple-800",
      "Y Tế Kỹ Thuật Số": "bg-indigo-100 text-indigo-800",
      "Sức Khỏe Môi Trường": "bg-emerald-100 text-emerald-800",
    };
    return styles[category] || "bg-gray-100 text-gray-800";
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentPage("detail");
  };

  const handleBackToListing = () => {
    setCurrentPage("listing");
    setSelectedPost(null);
  };

  // Blog Detail Page Component
  const BlogDetailPage = ({ post, onBack }) => (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại trang Blog
        </button>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(
              post.category
            )}`}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 font-serif">
          {post.title}
        </h1>

        {/* Author and Meta Information */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-4 text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-none">
          <div className="text-xl text-gray-600 leading-relaxed font-light mb-8">
            {post.excerpt}
          </div>
          <div
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(
                  /<h2>/g,
                  '<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 font-serif">'
                )
                .replace(/<p>/g, '<p class="mb-6">'),
            }}
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4 md:mr-6 md:mb-0 text-white mx-auto md:mx-0">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Về {post.author}
              </h3>
              <p className="text-gray-600 leading-relaxed">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Blog Listing Page Component
  const BlogListingPage = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 lg:py-24 relative z-10">
          <div className="text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              Nghiên Cứu & Đổi Mới Y Tế Học Đường
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Khám phá những nghiên cứu đột phá, các phát hiện sáng tạo và tư
              duy dẫn đầu từ các giảng viên và nhà nghiên cứu danh tiếng của
              Đại học Y Dược TPHCM về lĩnh vực y tế học đường.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Các Bài Viết & Nghiên Cứu Mới Nhất
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Luôn cập nhật những phát triển mới nhất trong nghiên cứu, giáo dục
            và đổi mới đang diễn ra tại các khoa và viện của Đại học Y Dược
            TPHCM liên quan đến sức khỏe học đường.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => handlePostClick(blogPosts[0])}
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 aspect-video md:w-1/2 md:aspect-auto overflow-hidden">
                <img
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-8 flex-1 md:w-1/2">
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(
                      blogPosts[0].category
                    )}`}
                  >
                    {blogPosts[0].category}
                  </span>
                </div>
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
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => handlePostClick(post)}
            >
              {/* Post Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 transition-colors hover:text-blue-600">
                  {post.title}
                </h3>

                {/* Post Excerpt */}
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Post Meta */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="font-medium">{post.author}</span>
                  <time>{post.date}</time>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Xem thêm bài viết
          </button>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Luôn Kết Nối Với Nghiên Cứu Y Tế Học Đường
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận bản tin của chúng tôi để nhận những cập nhật mới nhất
            về các đột phá nghiên cứu, thành tựu học thuật và tin tức từ Đại
            học Y Dược TPHCM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentPage === "detail" && selectedPost) {
    return <BlogDetailPage post={selectedPost} onBack={handleBackToListing} />;
  }

  return <BlogListingPage />;
}