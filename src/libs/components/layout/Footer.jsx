const Footer = () => (
  <footer className="bg-primary text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">F HealthCare</h3>
          <p className="opacity-90">Hòa Lạc, Hà Nội, Việt Nam</p>
          <p className="opacity-90">(024) 7300 1866</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Liên Kết Nhanh</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Chương Trình & Khoa
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Chăm Sóc Sức Khỏe
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Bản Đồ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Liên Hệ
              </a>
            </li>
          </ul>
        </div>{" "}
        <div>
          <h4 className="font-semibold mb-4">Dịch Vụ Y Tế</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                F HealthCare Y Khoa
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Chăm Sóc Sức Khỏe F
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Bệnh Viện Nhi
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Tìm Bác Sĩ
              </a>
            </li>
          </ul>
        </div>{" "}
        <div>
          <h4 className="font-semibold mb-4">Kết Nối</h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              Facebook
            </a>
            <a
              href="#"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              Twitter
            </a>
            <a
              href="#"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="opacity-90 hover:opacity-100 transition-opacity"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary mt-8 pt-8 text-center opacity-75">
        <p>&copy; 2024 Stanford University. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
