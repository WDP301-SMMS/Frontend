import React, { useState } from "react";

const Header = () => {
  const [isLoggedIn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className=" text-white px-4 py-2 font-bold text-lg">
            STANFORD
          </div>
          <nav className="hidden lg:block ml-8">
            <ul className="flex space-x-6">
              {["Home", "Health Care", "About", "Contact Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors duration-200"
              >
                <span className="text-gray-600 font-semibold">U</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Settings
                  </a>
                  <hr className="my-1" />
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          )}

          <button
            className="lg:hidden p-2 rounded-md hover:bg-blue-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-1"
                    : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-1"
                    : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="px-4 py-2">
            <ul className="space-y-2">
              {["Home", "Health Care", "About", "Contact Us"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <img
      src="https://www.stanford.edu/wp-content/uploads/2023/10/Hero-3-2-scaled.jpg"
      alt="Stanford University Campus"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="relative container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
        Stanford
      </h1>
      <h2 className="text-2xl md:text-3xl font-light mb-8 max-w-4xl mx-auto">
        A Mission Defined by Possibility
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
        At Stanford, a mission of discovery and learning is energized by a
        spirit of optimism and a passion for intellectual expansiveness,
        wide-ranging perspectives, and free to explore new lines of thinking.
      </p>
      <a
        href="/about"
        className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Discover Stanford
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
  const newsItems = [
    {
      title: "Why researchers wear masks in breakthrough study",
      image:
        "https://tse2.mm.bing.net/th/id/OIP.hQQ1z8SOv8NYyvIpVMhlBgHaEc?rs=1&pid=ImgDetMain",
    },
    {
      title: "Secretary of Energy Christine Granholm visits Stanford",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.5CbMByfwI-jv4nieVl05WAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: "Artificial Intelligence and real human connection",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.840k2vBDSw-gfvFi5NpzzQHaEJ?rs=1&pid=ImgDetMain",
    },
    {
      title: "Most likely to succeed: Student achievement stories",
      image:
        "https://www.salem.edu/wp-content/uploads/blocks/intro/SalemAcademyandCollege321.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Campus News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <NewsCard key={index} title={item.title} image={item.image} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            More Campus News
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
        className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        Learn More →
      </a>
    </div>
  </div>
);

const HealthCareSection = () => {
  const healthServices = [
    {
      title: "Lucile Packard Children's Hospital",
      description:
        "Leading pediatric and obstetric care, ranked among the nation's best children's hospitals.",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.yaq_l_0BJcO445mjejKjpAHaEO?rs=1&pid=ImgDetMain",
    },
    {
      title: "Mental Health Services",
      description:
        "Comprehensive mental health support for students, faculty, and community members.",
      image:
        "https://tse1.mm.bing.net/th/id/OIP.DPtkkqf56mzr0O2S58pW8wHaE8?rs=1&pid=ImgDetMain",
    },

    {
      title: "Health Education",
      description:
        "Training the next generation of healthcare professionals and advancing medical knowledge.",
      image:
        "https://tse1.mm.bing.net/th/id/OIF.Z5OQo3rSb5Rx2nWWHCscSA?rs=1&pid=ImgDetMain",
    },
  ];


  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-blue-800">
            Stanford Health Care
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Stanford Health Care, we're committed to providing exceptional
            patient care, advancing medical knowledge through research, and
            training the healthcare leaders of tomorrow. Our integrated approach
            combines clinical excellence with cutting-edge innovation.
          </p>
        </div>



        {/* Health Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {healthServices.map((service, index) => (
            <HealthCareServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Medical Care?</h3>
          <p className="text-lg mb-6 opacity-90">
            Schedule an appointment or find the right specialist for your
            healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Schedule Appointment
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
              Find a Doctor
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
          <p className="text-blue-600 mb-4">
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            Explore Academics
          </button>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ number, label }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md">
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-blue-600 text-white py-12">
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
      <div className="border-t border-blue-500 mt-8 pt-8 text-center opacity-75">
        <p>&copy; 2024 Stanford University. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CampusNewsSection />
      <HealthCareSection />
      <AcademicsSection />
      <ResearchSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Home;
