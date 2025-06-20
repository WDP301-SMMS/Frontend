import React, { useState } from 'react';

const Contact = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  // Dữ liệu FAQs
  const faqs = [
    {
      question: "Lịch tiêm chủng cho năm học này là khi nào?",
      answer: "Lịch tiêm chủng chi tiết cho từng khối lớp sẽ được thông báo trực tiếp đến phụ huynh qua email và cổng thông tin của nhà trường vào đầu mỗi học kỳ. Vui lòng kiểm tra thông báo định kỳ hoặc liên hệ với phòng y tế để biết thêm chi tiết."
    },
    {
      question: "Tôi cần làm gì nếu con tôi bị ốm ở trường?",
      answer: "Nếu học sinh cảm thấy không khỏe, các em nên báo ngay cho giáo viên chủ nhiệm. Giáo viên sẽ đưa học sinh đến phòng y tế để nhân viên y tế kiểm tra. Trong trường hợp cần thiết, phụ huynh sẽ được liên hệ để đưa học sinh về nhà hoặc đến cơ sở y tế."
    },
    {
      question: "Trường có hỗ trợ y tế cho học sinh có bệnh mãn tính không?",
      answer: "Có. Nhà trường cung cấp hỗ trợ y tế cho học sinh có bệnh mãn tính dựa trên kế hoạch chăm sóc sức khỏe cá nhân (Individual Health Plan - IHP) do phụ huynh và bác sĩ cung cấp. Vui lòng liên hệ phòng y tế để thảo luận và lập kế hoạch cụ thể cho con bạn."
    },
    {
      question: "Quy trình cấp phát thuốc tại trường như thế nào?",
      answer: "Tất cả các loại thuốc cần được quản lý và cấp phát bởi nhân viên y tế tại phòng y tế. Phụ huynh cần cung cấp đơn thuốc gốc từ bác sĩ và điền vào mẫu chấp thuận cấp phát thuốc của nhà trường. Thuốc phải được đựng trong bao bì gốc với nhãn rõ ràng."
    },
    {
      question: "Làm thế nào để báo cáo tình trạng dị ứng của học sinh?",
      answer: "Phụ huynh vui lòng thông báo ngay lập tức về bất kỳ tình trạng dị ứng nào của học sinh (đặc biệt là dị ứng thực phẩm, thuốc men, hoặc môi trường) cho giáo viên chủ nhiệm và phòng y tế. Cần cung cấp thông tin chi tiết về các tác nhân gây dị ứng và kế hoạch xử lý khi có phản ứng dị ứng."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const EmailIcon = () => (
    <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13V3"></path>
    </svg>
  );

  const EmergencyIcon = () => (
    <svg className="w-7 h-7 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const HelpOutlineIcon = () => (
    <svg className="w-7 h-7 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.247a8.672 8.672 0 00-1.65-.658C5.356 8.52 4.412 8 3.5 8c-.287 0-.573.006-.856.018m17.514 0c-.283-.012-.57-.018-.857-.018-.912 0-1.856.52-3.078 1.089a8.672 8.672 0 00-1.65.658m-8.795 0h.01m-4.493 0h.01M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  );

  const LocationOnIcon = () => (
    <svg className="w-7 h-7 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657m11.314-11.314L13.414 3.1a1.998 1.998 0 00-2.828 0L6.343 5.657m11.314 11.314l-4.95 4.95m-3.536-3.536l-4.95-4.95M12 8h.01M12 12h.01M12 16h.01M12 20h.01M12 24h.01"></path>
    </svg>
  );

  const ChevronDownIcon = ({ isOpen }) => (
    <svg
      className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
        }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Liên hệ Y tế Học đường</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm flex flex-col">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
              <EmailIcon />
              Liên hệ qua Email
            </h2>
            <p className="text-gray-700 mb-4">
              Đối với các câu hỏi chung, thắc mắc về sức khỏe không khẩn cấp, hoặc yêu cầu thông tin, vui lòng điền vào biểu mẫu dưới đây.
              Chúng tôi sẽ phản hồi bạn trong vòng 24-48 giờ làm việc.
            </p>
            <form className="space-y-4 flex flex-col flex-grow">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email của bạn</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Chủ đề</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Câu hỏi về tiêm chủng"
                />
              </div>
              <div className="flex-grow">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y min-h-[80px]"
                  placeholder="Viết tin nhắn của bạn ở đây..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-auto"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm flex flex-col">
            <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
              <EmergencyIcon />
              Trường hợp khẩn cấp
            </h2>
            <p className="text-gray-700 mb-4">
              Trong trường hợp khẩn cấp về sức khỏe hoặc cần hỗ trợ y tế ngay lập tức, vui lòng không sử dụng biểu mẫu này.
              Thay vào đó, hãy thực hiện các bước sau:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 flex-grow">
              <li>Tìm kiếm nhân viên y tế học đường tại phòng y tế.</li>
              <li>Liên hệ trực tiếp số điện thoại khẩn cấp của nhà trường (nếu có).</li>
              <li>Gọi số điện thoại cấp cứu y tế địa phương (ví dụ: 115 ở Việt Nam) nếu tình huống nguy hiểm đến tính mạng.</li>
            </ul>
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md text-red-800 font-semibold">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Hãy ưu tiên sự an toàn và tìm kiếm sự giúp đỡ chuyên nghiệp ngay lập tức khi cần!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <HelpOutlineIcon />
            Câu hỏi Thường Gặp (FAQs)
          </h2>
          <p className="text-gray-700 mb-6">
            Trước khi gửi email, bạn có thể kiểm tra danh sách các câu hỏi thường gặp của chúng tôi. Nhấp vào câu hỏi để xem câu trả lời!
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDownIcon isOpen={openFAQ === index} />
                </button>
                {openFAQ === index && (
                  <div className="p-4 pt-2 text-gray-700 bg-white border-t border-gray-200 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 shadow-sm">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
            <LocationOnIcon />
            Vị trí & Giờ làm việc
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>Phòng Y tế Trường:</strong> Trường Tiểu học Lê Văn Việt, 36 Man Thiện, Hiệp Phú, Quận 9, TP.Hồ Chí Minh
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Giờ làm việc:</strong> 7:00 Sáng- 17:30 Chiều, Thứ Hai - Thứ Sáu
          </p>
          <div className="w-full h-64 rounded-md overflow-hidden border border-gray-300">
            <iframe
              title="Bản đồ vị trí"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=36+Man+Thiện,+Hiệp+Phú,+Quận+9,+Hồ+Chí+Minh,+Việt+Nam&hl=vi&z=16&output=embed"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;