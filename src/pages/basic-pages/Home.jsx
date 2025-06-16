import React, { useState } from "react";
import Header from "~/libs/components/layout/Header";
import Footer from "~/libs/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white">
    <img
      src="https://www.stanford.edu/wp-content/uploads/2023/10/Hero-3-2-scaled.jpg"
      alt="F HealthCare Campus"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="relative container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
        F HealthCare
      </h1>
      <h2 className="text-2xl md:text-3xl font-light mb-8 max-w-4xl mx-auto">
        Sứ Mệnh Được Định Nghĩa Bởi Khả Năng
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
        Tại F HealthCare, sứ mệnh khám phá và học hỏi được tiếp thêm sinh lực
        bởi tinh thần lạc quan và đam mê mở rộng tri thức, với góc nhìn đa dạng
        và tự do để khám phá những cách suy nghĩ mới.
      </p>
      <a
        href="/about"
        className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Khám Phá F HealthCare
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

const CampusNewsSection = () => {
  const navigate = useNavigate();
  const newsItems = [
    {
      title:
        "Tại sao các nhà nghiên cứu đeo khẩu trang trong nghiên cứu đột phá",
      image:
        "https://tse2.mm.bing.net/th/id/OIP.hQQ1z8SOv8NYyvIpVMhlBgHaEc?rs=1&pid=ImgDetMain",
    },
    {
      title: "Bộ trưởng Năng lượng Christine Granholm thăm F HealthCare",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.5CbMByfwI-jv4nieVl05WAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Trí tuệ nhân tạo và kết nối con người thực sự",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.840k2vBDSw-gfvFi5NpzzQHaEJ?rs=1&pid=ImgDetMain",
    },
    {
      title: "Khả năng thành công cao nhất: Câu chuyện thành tích sinh viên",
      image:
        "https://www.salem.edu/wp-content/uploads/blocks/intro/SalemAcademyandCollege321.jpg",
    },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Tin Tức</h2>
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
            Xem Thêm Tin Tức
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

const HealthCareSection = () => {
  const healthServices = [
    {
      title: "Bệnh Viện Nhi Lucile Packard",
      description:
        "Dịch vụ chăm sóc nhi khoa và sản khoa hàng đầu, được xếp hạng trong số các bệnh viện nhi tốt nhất quốc gia.",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.yaq_l_0BJcO445mjejKjpAHaEO?rs=1&pid=ImgDetMain",
    },
    {
      title: "Dịch Vụ Sức Khỏe Tâm Thần",
      description:
        "Hỗ trợ sức khỏe tâm thần toàn diện cho sinh viên, giảng viên và thành viên cộng đồng.",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.DPtkkqf56mzr0O2S58pW8wHaE8?rs=1&pid=ImgDetMain",
    },

    {
      title: "Giáo Dục Y Tế",
      description:
        "Đào tạo thế hệ chuyên gia y tế tương lai và phát triển kiến thức y khoa.",
      image:
        "https://tse1.mm.bing.net/th/id/OIF.Z5OQo3rSb5Rx2nWWHCscSA?rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-blue-800">
            F HealthCare
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tại F HealthCare, chúng tôi cam kết cung cấp dịch vụ chăm sóc bệnh
            nhân xuất sắc, phát triển kiến thức y khoa thông qua nghiên cứu, và
            đào tạo các nhà lãnh đạo y tế tương lai. Phương pháp tích hợp của
            chúng tôi kết hợp giữa sự xuất sắc lâm sàng với đổi mới tiên tiến.
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
          <h3 className="text-2xl font-bold mb-4">Cần Chăm Sóc Y Tế?</h3>
          <p className="text-lg mb-6 opacity-90">
            Đặt lịch hẹn hoặc tìm bác sĩ chuyên khoa phù hợp cho nhu cầu chăm
            sóc sức khỏe của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Đặt Lịch Hẹn
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
              Tìm Bác Sĩ
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

const AcademicsSection = () => {
  const academicAreas = [
    {
      title: "Undergraduate Education",
      description: "Comprehensive liberal arts foundation",
      image:
        "https://tulane.edu/sites/default/files/images/universal-landing/24608125694_f3463370e8_k%20copy.jpg",
    },
    {
      title: "Graduate Education",
      description: "Advanced research and scholarship",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.yeeEIPyhXm2QZep7zr61GQHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Continuing Studies",
      description: "Lifelong learning opportunities",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.3hP2UhljgTB65QFIPuYIjwHaE8?rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Academics</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Preparing students to make meaningful contributions to society as
            engaged citizens and leaders in a complex world
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
              Law
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Humanities & Sciences
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Engineering
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Sustainability
            </a>{" "}
            |
            <a href="#" className="hover:underline ml-2">
              Business
            </a>
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Explore Academics
          </button>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ number, label }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md">
    <div className="text-3xl font-bold text-primary mb-2">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const ResearchSection = () => {
  const stats = [
    { number: "6,869", label: "Researchers" },
    { number: "$350M", label: "Research Funding" },
    { number: "5,029", label: "US Patents" },
    { number: "400+", label: "Research Centers" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Research</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Driving discoveries to improve health and our world through
            innovative research
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="text-center">
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Explore Research
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

const EventsSection = () => {
  const events = [
    {
      title: "University Orchestra Showcase",
      image:
        "https://th.bing.com/th/id/R.4de43d4c83765065d64b027c773bc367?rik=AMCoiMtWWBtYKQ&pid=ImgRaw&r=0",
    },
    {
      title: "Climate Health Symposium",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.w8J7jCDPJ2UHQwAp7kuHCQHaD4?w=600&h=314&rs=1&pid=ImgDetMain",
    },
    {
      title: "Stanford Energy Week",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.VhRyvBW-HKRcMNGy8AeIiQHaE8?rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            View All Events
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
      <CampusNewsSection />
      <HealthCareSection />
      <AcademicsSection />
      <ResearchSection />
      <EventsSection />
    </div>
  );
};

export default Home;
