import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "~/assets/images/Home.jpg"

// Adjusted Hero Section for a school healthcare theme
const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white">
    <img
      src={HomeHero}
      alt="EduCare School Health"
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="relative container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
        EduCare-Sức Khỏe Học Đường
      </h1>
      <h2 className="text-2xl md:text-3xl font-light mb-8 max-w-4xl mx-auto">
        Chăm Sóc Toàn Diện Cho Học Sinh, Nâng Cao Sức Khỏe Cộng Đồng
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
        Tại EduCare Sức Khỏe Học Đường, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
        giáo dục phòng ngừa và các chương trình nâng cao thể chất, tinh thần cho toàn thể học sinh và cán bộ.
      </p>
      <a
        href="/about"
        className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Tìm Hiểu Dịch Vụ Của Chúng Tôi
      </a>
    </div>
  </section>
);

const NewsCard = ({ title, image }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <p className="text-gray-800 font-medium leading-relaxed">{title}</p>
    </div>
  </div>
);

// Adjusted Campus News Section for health-related news
const CampusNewsSection = () => {
  const navigate = useNavigate();
  const newsItems = [
    {
      title: "Chiến dịch tiêm chủng cúm mùa học đường: Bảo vệ sức khỏe cộng đồng",
      image:
        "https://tse2.mm.bing.net/th/id/OIP.hQQ1z8SOv8NYyvIpVMhlBgHaEc?rs=1&pid=ImgDetMain",
    },
    {
      title: "Tầm quan trọng của sức khỏe tinh thần trong môi trường học đường",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.5CbMByfwI-jv4nieVl05WAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Phòng chống dịch bệnh tay chân miệng và sốt xuất huyết tại trường",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.840k2vBDSw-gfvFi5NpzzQHaEJ?rs=1&pid=ImgDetMain",
    },
    {
      title: "Ngày hội sức khỏe học đường: Kiểm tra tổng quát và tư vấn dinh dưỡng",
      image:
        "https://www.salem.edu/wp-content/uploads/blocks/intro/SalemAcademyandCollege321.jpg",
    },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Tin Tức Sức Khỏe Học Đường</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <NewsCard key={index} title={item.title} image={item.image} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/blogs")}
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Xem Thêm Tin Tức Sức Khỏe
          </button>
        </div>
      </div>
    </section>
  );
};

const HealthCareServiceCard = ({ title, description, image, icon }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-3 text-blue-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <a
        href="#"
        className="inline-block mt-4 text-primary hover:text-blue-800 font-medium transition-colors duration-200"
      >
        Tìm Hiểu Thêm →
      </a>
    </div>
  </div>
);

// Adjusted HealthCare Section for school-specific health services
const HealthCareSection = () => {
  const healthServices = [
    {
      title: "Phòng Y Tế Học Đường",
      description:
        "Cung cấp sơ cứu, khám sức khỏe định kỳ và tư vấn y tế cho học sinh và cán bộ trong trường.",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.yaq_l_0BJcO445mjejKjpAHaEO?rs=1&pid=ImgDetMain", // Consider an image of a school clinic
    },
    {
      title: "Tư Vấn Sức Khỏe Tâm Lý",
      description:
        "Hỗ trợ tâm lý, tư vấn các vấn đề về học tập, mối quan hệ và áp lực thi cử cho học sinh.",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.DPtkkqf56mzr0O2S58pW8wHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Chương Trình Giáo Dục Sức Khỏe",
      description:
        "Tổ chức các buổi nói chuyện chuyên đề, workshop về dinh dưỡng, vệ sinh cá nhân và phòng chống dịch bệnh.",
      image:
        "https://tse1.mm.bing.net/th/id/OIF.Z5OQo3rSb5Rx2nWWHCscSA?rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-blue-800">
            Dịch Vụ Sức Khỏe Học Đường
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tại EduCare Sức Khỏe Học Đường, chúng tôi ưu tiên sức khỏe và sự an toàn của học sinh.
            Chúng tôi cung cấp một loạt các dịch vụ y tế và chương trình giáo dục sức khỏe nhằm
            đảm bảo một môi trường học tập lành mạnh và an toàn.
          </p>
        </div>

        {/* Health Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {healthServices.map((service, index) => (
            <HealthCareServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cần Hỗ Trợ Y Tế?</h3>
          <p className="text-lg mb-6 opacity-90">
            Liên hệ với phòng y tế hoặc tìm hiểu thêm về các dịch vụ chăm sóc sức khỏe của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Liên Hệ Phòng Y Tế
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
              Xem Chính Sách Sức Khỏe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionCard = ({ title, description, image }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  </div>
);

// Re-purpose Academics Section to focus on health education/programs
const AcademicsSection = () => {
  const academicAreas = [
    {
      title: "Chương Trình Giáo Dục Sức Khỏe",
      description: "Các khóa học và hoạt động về sức khỏe thể chất và tinh thần",
      image:
        "https://tulane.edu/sites/default/files/images/universal-landing/24608125694_f3463370e8_k%20copy.jpg", // Image of students learning about health
    },
    {
      title: "Huấn Luyện Sơ Cứu & Cấp Cứu",
      description: "Đào tạo kỹ năng sơ cứu cơ bản cho học sinh và cán bộ",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.yeeEIPyhXm2QZep7zr61GQHaE8?rs=1&pid=ImgDetMain", // Image of first aid training
    },
    {
      title: "Hoạt Động Nâng Cao Thể Chất",
      description: "Các câu lạc bộ thể thao, yoga, và hoạt động ngoài trời",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.3hP2UhljgTB65QFIPuYIjwHaE8?rs=1&pid=ImgDetMain", // Image of students doing physical activities
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Các Chương Trình Sức Khỏe</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp các chương trình giáo dục và hoạt động thiết thực nhằm nâng cao
            nhận thức và xây dựng lối sống lành mạnh cho cộng đồng học đường.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {academicAreas.map((area, index) => (
            <SectionCard key={index} {...area} />
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-primary mb-4">
            <a href="#" className="hover:underline">
              Dinh Dưỡng
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Sức Khỏe Tâm Thần
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Phòng Chống Dịch Bệnh
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Thể Dục Thể Thao
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              An Toàn Học Đường
            </a>
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Khám Phá Các Chương Trình
          </button>
        </div>
      </div>
    </section>
  );
};

// Re-purpose Research Section for health-related statistics/impact
const StatCard = ({ number, label }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md">
    <div className="text-3xl font-bold text-primary mb-2">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const ResearchSection = () => {
  const stats = [
    { number: "95%", label: "Tỷ Lệ Học Sinh Khỏe Mạnh" },
    { number: "20+", label: "Chương Trình Sức Khỏe Cộng Đồng" },
    { number: "150+", label: "Buổi Tư Vấn Tâm Lý/Năm" },
    { number: "10+", label: "Chiến Dịch Y Tế Học Đường" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tác Động Sức Khỏe Học Đường</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Những con số này thể hiện cam kết của chúng tôi trong việc xây dựng một cộng đồng học đường
            khỏe mạnh và an toàn.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="text-center">
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Xem Báo Cáo Sức Khỏe
          </button>
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ title, image }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  </div>
);

// Adjusted Events Section for school health-related events
const EventsSection = () => {
  const events = [
    {
      title: "Ngày Hội Sức Khỏe & Dinh Dưỡng Học Đường",
      image:
        "https://th.bing.com/th/id/R.4de43d4c83765065d64b027c773bc367?rik=AMCoiMtWWBtYKQ&pid=ImgRaw&r=0", // Image of a health fair
    },
    {
      title: "Hội Thảo Chuyên Đề: Quản Lý Căng Thẳng Trong Học Tập",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.w8J7jCDPJ2UHQwAp7kuHCQHaD4?w=600&h=314&rs=1&pid=ImgDetMain", // Image of a symposium/workshop
    },
    {
      title: "Giải Chạy Bộ Sức Khỏe Học Đường EduCare",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.VhRyvBW-HKRcMNGy8AeIiQHaE8?rs=1&pid=ImgDetMain", // Image of a school sports event
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Sự Kiện Sức Khỏe Sắp Tới</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Xem Tất Cả Sự Kiện
          </button>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CampusNewsSection /> {/* Renamed implicitly to "Tin Tức Sức Khỏe Học Đường" */}
      <HealthCareSection />
      <AcademicsSection /> {/* Repurposed as "Các Chương Trình Sức Khỏe" */}
      <ResearchSection /> {/* Repurposed as "Tác Động Sức Khỏe Học Đường" */}
      <EventsSection /> {/* Renamed implicitly to "Sự Kiện Sức Khỏe Sắp Tới" */}
    </div>
  );
};

export default Home;