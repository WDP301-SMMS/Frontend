import React from "react";
import Header from "~/libs/components/layout/Header";
import Footer from "~/libs/components/layout/Footer";

const HeroSection = () => (
  <section className="relative">
    <div className="w-full">
      <img
        src="https://www.stanford.edu/wp-content/uploads/2023/10/Hero-3-2-scaled.jpg"
        alt="Stanford University Main Quad"
        className="w-full h-96 object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center">
        Who We Are
      </h1>
    </div>
  </section>
);

const MissionSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 max-w-4xl">
      <p className="text-lg leading-relaxed text-gray-700 text-center">
        From its founding in California in the late 19th century until today,
        Stanford has been infused with the American West's spirit of openness
        and possibility. We believe strongly in the mission of higher education
        – to create and share knowledge and to prepare students to be curious,
        to think critically, and to contribute to the world. With world-class
        scholars and seven schools located together on a single campus, Stanford
        offers academic excellence across the broadest array of disciplines. It
        also is an engine of innovation, blending theory and practice to move
        ideas and discoveries from labs and classrooms out into the world. We
        strive to foster a culture of expansive inquiry, fresh thinking,
        searching discussion, and freedom of thought – preparing students for
        leadership and engaged citizenship in the world.
      </p>
    </div>
  </section>
);

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
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          reverse ? "lg:grid-flow-col-dense" : ""
        }`}
      >
        <div className={reverse ? "lg:col-start-2" : ""}>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            {content}
          </div>
          <button
            className={`${buttonColor} text-white px-8 py-3 rounded-md font-semibold transition-colors duration-300 mt-6`}
          >
            {buttonText}
          </button>
        </div>
        <div className={reverse ? "lg:col-start-1" : ""}>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-64 lg:h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AcademicsSection = () => (
  <FeatureSection
    title="Excellence in education across disciplines"
    content={
      <div>
        <p className="mb-4">
          Stanford provides students the opportunity to engage with big ideas,
          to cross conceptual and disciplinary boundaries, and to become global
          citizens who embrace diversity of thought and experiences. We offer
          broad and deep programs of study rooted in the liberal arts including
          the natural sciences, humanities, natural and social sciences,
          engineering, sustainability, medicine, law, education, and business.
        </p>
        <p className="mb-4">
          The university's scholarly excellence and culture of innovation
          uniquely position it to attract the best faculty in the world, who
          offer students the knowledge and tools to discover and develop their
          intellectual passions, to acquire habits of lifelong learning and
          service. The need for strong ethical principles to achieve a common
          good is embedded across our educational offerings.
        </p>
      </div>
    }
    image="https://tse2.mm.bing.net/th/id/OIP.F8DKsonuNg4JfDeNEH1OEgHaEL?r=0&rs=1&pid=ImgDetMain"
    buttonText="Learn more about academics"
    buttonColor="bg-blue-600 hover:bg-blue-700"
  />
);

const DialogueSection = () => (
  <FeatureSection
    title="Encouraging open minds and constructive dialogue"
    content={
      <div>
        <p className="mb-4">
          Discovery and learning require fresh ideas and open discussion. We
          strive to foster searching discussion, to listen with curiosity, and
          to ensure the freedom of our university community to study and learn.
          This includes the freedom to pursue knowledge without compromise; the
          freedom to challenge orthodoxy, whether old or new, and the freedom to
          think and speak openly.
        </p>
        <p className="mb-4">
          Pluribus Stanford, a key university-wide initiative, empowers students
          to navigate difference with curiosity and respect, to build community
          and learn across differences, and embrace active, life-long roles in
          civic life through whatever field or career path they pursue. Stanford
          believes that addressing the challenges the world faces requires
          people from diverse disciplines and backgrounds coming together and
          deliberating across disagreement.
        </p>
        <p>
          We advance these institutional goals by nurturing and everything
          research and education related to free speech, civics, democratic
          citizenship, and constructive dialogue.
        </p>
      </div>
    }
    image="https://tse3.mm.bing.net/th/id/OIP.cGdWzvwePQrHeIOljFkkjQHaE8?r=0&rs=1&pid=ImgDetMain"
    buttonText="Learn more about e-Pluribus"
    buttonColor="bg-blue-600 hover:bg-blue-700"
    reverse={true}
  />
);

const ResearchSection = () => (
  <FeatureSection
    title="Interdisciplinary research fueled by innovation"
    content={
      <div>
        <p className="mb-4">
          A hallmark of Stanford is our extensive and vibrant ecosystem of
          interdisciplinary research. With all seven of Stanford's schools
          located on our historic campus and many institutes serving as a hub
          for collaboration across academic fields, the opportunities for
          disruptive breakthroughs are numerous and the results are evident.
        </p>
        <p className="mb-4">
          Our newest school in 70 years, the Stanford Doerr School of
          Sustainability, draws on deep interdisciplinary collaboration to
          tackle the urgent challenge of climate change and to develop scalable
          sustainability solutions. Stanford's community of scholars is
          recognized for accomplishments across a broad range of academic
          fields. In addition to 26 Nobel Prize winners since the university's
          founding – tied among research universities for the most Nobel Prizes
          since 2000 – 2020.
        </p>
        <p className="mb-4">
          Stanford faculty includes recipients of the Turing Award, Fields
          Medal, and MacArthur Fellows. Discoveries made at Stanford not only
          expand our understanding of the world but also fuel the innovation
          economy and America's international competitiveness.
        </p>
      </div>
    }
    image="https://tse3.mm.bing.net/th/id/OIP.K47_PQ3CcEVl56tSgCczBwHaE8?r=0&rs=1&pid=ImgDetMain"
    buttonText="Learn more about research"
    buttonColor="bg-blue-600 hover:bg-blue-700"
  />
);

const ValuesSection = () => {
  const values = [
    {
      title: "Academic Excellence",
      description:
        "We pursue the highest standards of teaching and research across all disciplines.",
      icon: "🎓",
    },
    {
      title: "Innovation",
      description:
        "We foster creativity and entrepreneurship to solve the world's most pressing challenges.",
      icon: "💡",
    },
    {
      title: "Diversity & Inclusion",
      description:
        "We embrace diverse perspectives and create an inclusive community for all.",
      icon: "🤝",
    },
    {
      title: "Global Impact",
      description:
        "We prepare leaders who will make a positive difference in the world.",
      icon: "🌍",
    },
    {
      title: "Ethical Leadership",
      description:
        "We instill strong moral principles and responsible citizenship.",
      icon: "⚖️",
    },
    {
      title: "Lifelong Learning",
      description:
        "We cultivate curiosity and the pursuit of knowledge throughout life.",
      icon: "📚",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do at Stanford University
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionSection />
      <AcademicsSection />
      <DialogueSection />
      <ResearchSection />
      <ValuesSection />
    </div>
  );
};

export default About;
