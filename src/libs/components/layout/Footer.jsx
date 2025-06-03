
const Footer = () => (
  <footer className="bg-primary text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Stanford University</h3>
          <p className="opacity-90">Stanford, California 94305</p>
          <p className="opacity-90">(650) 723-2300</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Schools & Programs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Health Care
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Campus Map
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Health Services</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Stanford Medicine
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Stanford Health Care
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Children's Hospital
              </a>
            </li>
            <li>
              <a
                href="#"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                Find a Doctor
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
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