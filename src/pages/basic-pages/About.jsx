import React from "react";

// Hero Section
const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white">
    <div className="w-full">
      <img
        src="https://www.cdnsba.org/wp-content/uploads/2025/02/school-health-image-1024x512.png"
        alt="Phòng Y tế Học đường EduCare"
        className="w-full h-96 object-cover opacity-50"
      />
    </div>
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4">
        EduCare - Chăm Sóc Sức Khỏe Học Đường
      </h1>
    </div>
  </section>
);

// Mission Section
const MissionSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-4xl">
      <p className="text-lg leading-relaxed text-gray-700 text-center">
        Tại EduCare, chúng tôi cam kết mang đến một môi trường học tập an toàn và khỏe mạnh
        cho toàn thể học sinh và cán bộ giáo viên. Được xây dựng với sứ mệnh chăm sóc toàn diện
        sức khỏe thể chất và tinh thần cho cộng đồng học đường, EduCare luôn nỗ lực để trở thành
        điểm tựa đáng tin cậy, giúp các em phát triển tối đa tiềm năng của mình. Chúng tôi tin rằng
        một sức khỏe tốt là nền tảng vững chắc cho sự thành công trong học tập và cuộc sống.
      </p>
    </div>
  </section>
);

// Feature Section Template
const FeatureSection = ({
  title,
  content,
  image,
  buttonText,
  buttonColor = "bg-blue-600 hover:bg-blue-700",
  reverse = false,
}) => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:grid-flow-col-dense" : ""}`}>
        <div className={reverse ? "lg:col-start-2" : ""}>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">{content}</div>
          <button
            className={`${buttonColor} text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 mt-6`}
          >
            {buttonText}
          </button>
        </div>
        <div className={reverse ? "lg:col-start-1" : ""}>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={image} alt={title} className="w-full h-64 lg:h-80 object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Primary Health Care
const PrimaryCareSection = () => (
  <FeatureSection
    title="Chăm sóc sức khỏe ban đầu toàn diện"
    content={
      <>
        <p>
          EduCare cung cấp các dịch vụ chăm sóc sức khỏe ban đầu như sơ cứu, xử lý các tình huống cấp bách,
          kiểm tra sức khỏe định kỳ, và quản lý hồ sơ sức khỏe cá nhân cho từng học sinh. Đội ngũ y tế chuyên nghiệp
          luôn túc trực để đảm bảo mọi vấn đề sức khỏe phát sinh trong giờ học đều được xử lý kịp thời và hiệu quả.
        </p>
        <p>
          Chúng tôi chú trọng đến việc phòng ngừa dịch bệnh thông qua các hoạt động vệ sinh trường học,
          hướng dẫn rửa tay đúng cách, và tổ chức tiêm chủng theo quy định. Mục tiêu là xây dựng một cộng đồng
          trường học miễn dịch khỏe mạnh, hạn chế tối đa sự lây lan của bệnh truyền nhiễm.
        </p>
      </>
    }
    image="https://tse2.mm.bing.net/th/id/OIP.F8DKsonuNg4JfDeNEH1OEgHaEL"
    buttonText="Tìm hiểu thêm về dịch vụ y tế"
  />
);

// Health Education
const HealthEducationSection = () => (
  <FeatureSection
    title="Giáo dục và tư vấn sức khỏe chủ động"
    content={
      <>
        <p>
          Ngoài điều trị, EduCare còn nâng cao nhận thức về sức khỏe cho học sinh thông qua các buổi nói chuyện chuyên đề,
          hội thảo và hoạt động ngoại khóa về dinh dưỡng, vệ sinh cá nhân, phòng chống tai nạn thương tích và sức khỏe sinh sản.
        </p>
        <p>
          Chúng tôi khuyến khích học sinh tự giác chăm sóc sức khỏe bằng cách cung cấp thông tin đáng tin cậy
          và không gian mở để đặt câu hỏi và chia sẻ băn khoăn. EduCare cũng hỗ trợ tư vấn tâm lý ban đầu,
          giúp các em vượt qua khó khăn về cảm xúc và tinh thần.
        </p>
        <p>
          Trang bị kiến thức và kỹ năng cần thiết sẽ giúp học sinh chủ động bảo vệ sức khỏe của mình
          không chỉ trong trường học mà còn trong cuộc sống hàng ngày.
        </p>
      </>
    }
    image="https://tse3.mm.bing.net/th/id/OIP.cGdWzvwePQrHeIOljFkkjQHaE8"
    buttonText="Khám phá các chương trình giáo dục sức khỏe"
    reverse
  />
);

// Safe School Environment
const SafeEnvironmentSection = () => (
  <FeatureSection
    title="Xây dựng môi trường học tập an toàn và hỗ trợ"
    content={
      <>
        <p>
          EduCare phối hợp với nhà trường và phụ huynh để xây dựng môi trường học tập an toàn, thân thiện
          và không bạo lực. Chúng tôi thường xuyên kiểm tra cơ sở vật chất, đảm bảo an toàn vệ sinh thực phẩm
          và giám sát khu vực vui chơi để phòng tránh tai nạn.
        </p>
        <p>
          Chúng tôi hỗ trợ học sinh có nhu cầu đặc biệt về y tế, đảm bảo các em nhận được chăm sóc phù hợp
          và hòa nhập tốt vào môi trường học đường.
        </p>
        <p>
          Đội ngũ y tế EduCare luôn tận tâm không chỉ trong việc chữa bệnh mà còn tạo nền tảng vững chắc
          để học sinh phát triển toàn diện trong môi trường an toàn và được quan tâm.
        </p>
      </>
    }
    image="https://tse3.mm.bing.net/th/id/OIP.K47_PQ3CcEVl56tSgCczBwHaE8"
    buttonText="Tìm hiểu về các hoạt động an toàn trường học"
  />
);

// Core Values
const ValuesSection = () => {
  const values = [
    { title: "Chăm sóc toàn diện", description: "Dịch vụ chăm sóc sức khỏe thể chất và tinh thần.", icon: "❤️" },
    { title: "Phòng ngừa chủ động", description: "Tập trung vào phòng ngừa dịch bệnh và giáo dục sức khỏe.", icon: "🛡️" },
    { title: "An toàn tuyệt đối", description: "Môi trường học đường an toàn, không bạo lực.", icon: "✅" },
    { title: "Tư vấn tận tâm", description: "Lắng nghe và tư vấn sức khỏe, tâm lý chuyên nghiệp.", icon: "💬" },
    { title: "Phối hợp chặt chẽ", description: "Kết nối giữa nhà trường, phụ huynh và y tế.", icon: "🤝" },
    { title: "Phát triển bền vững", description: "Không ngừng cải tiến chất lượng dịch vụ y tế học đường.", icon: "📈" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi của EduCare</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Những nguyên tắc định hướng mọi hoạt động của chúng tôi tại Phòng Y tế Học đường
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main About Component
const About = () => (
  <div className="min-h-screen">
    <HeroSection />
    <MissionSection />
    <PrimaryCareSection />
    <HealthEducationSection />
    <SafeEnvironmentSection />
    <ValuesSection />
  </div>
);

export default About;
