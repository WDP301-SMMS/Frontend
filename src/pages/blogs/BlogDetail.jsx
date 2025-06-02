export default function BlogDetail({
  title = "Conversations with London Makr & Co.",
  author = "Olivia Rhye",
  authorBio = "Olivia is a product designer and researcher with over 8 years of experience in the design industry.",
  publishDate = "20 Jan 2024",
  readTime = "5 min read",
  featuredImage = "/placeholder.svg?height=600&width=1200",
  categories = ["Design", "Research", "Interviews"],
  content = null,
}) {
  const getCategoryColor = (category) => {
    const colors = {
      Design: "bg-red-50 text-[#8C1515]",
      Research: "bg-blue-50 text-blue-700",
      Interviews: "bg-green-50 text-green-700",
      Business: "bg-purple-50 text-purple-700",
      Health: "bg-orange-50 text-orange-700",
      Technology: "bg-gray-100 text-gray-700",
    }
    return colors[category] || "bg-gray-100 text-gray-600"
  }

  // Custom SVG Icons
  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12,19 5,12 12,5"></polyline>
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )

  const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  )

  const UserIcon = ({ size = "w-6 h-6" }) => (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )

  const BookmarkIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )

  const ShareIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  )

  const defaultContent = (
    <div className="space-y-6">
      <p className="text-xl text-gray-600 leading-relaxed font-light">
        We sat down with London's fast-growing brand and product design studio, Makr & Co, to find out how they've used
        innovative design principles to 2x their revenue.
      </p>

      <p className="text-gray-700 leading-relaxed">
        Founded in 2019, Makr & Co has quickly become one of London's most sought-after design studios, working with
        everyone from early-stage startups to Fortune 500 companies.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-4">The Journey to Success</h2>

      <p className="text-gray-700 leading-relaxed">
        "When we started Makr & Co, we knew we wanted to do things differently," says Sarah Johnson, co-founder and
        Creative Director. "We weren't just interested in making things look pretty – we wanted to solve real problems
        for real people."
      </p>

      <blockquote className="border-l-4 border-[#8C1515] pl-6 py-4 my-8 bg-red-50 rounded-r-lg">
        <p className="text-lg italic text-gray-700 mb-4 leading-relaxed">
          "Design isn't just about aesthetics. It's about creating experiences that resonate with people on a deeper
          level."
        </p>
        <cite className="text-sm font-medium text-[#8C1515]">— Sarah Johnson, Creative Director</cite>
      </blockquote>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-4">Key Principles</h2>

      <ul className="space-y-3 text-gray-700">
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-[#8C1515] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <div>
            <strong className="text-gray-800">User-Centered Design:</strong> Every decision starts with understanding
            the end user's needs.
          </div>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-[#8C1515] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <div>
            <strong className="text-gray-800">Iterative Process:</strong> Continuous testing and refinement based on
            real feedback.
          </div>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-[#8C1515] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <div>
            <strong className="text-gray-800">Cross-Functional Collaboration:</strong> Designers, developers, and
            strategists work together.
          </div>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-[#8C1515] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <div>
            <strong className="text-gray-800">Data-Driven Decisions:</strong> Analytics and user research inform every
            design choice.
          </div>
        </li>
      </ul>

      <div className="bg-gray-50 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Impact by the Numbers</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#8C1515] mb-2">200%</div>
            <div className="text-sm text-gray-600">Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#8C1515] mb-2">50+</div>
            <div className="text-sm text-gray-600">Successful Projects</div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        As Makr & Co continues to grow, they're expanding their services to include strategic consulting and design
        systems development. "We're not just designing products anymore," explains Johnson. "We're helping companies
        build design cultures that can scale."
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <button className="inline-flex items-center text-[#8C1515] font-medium hover:underline transition-colors">
          <ArrowLeftIcon />
          <span className="ml-2">Back to blog</span>
        </button>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 max-w-4xl pb-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <span key={index} className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">{title}</h1>

        {/* Author and Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8C1515] to-[#B83A4B] flex items-center justify-center mr-4 text-white">
              <UserIcon size="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{author}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <CalendarIcon />
                  <span className="ml-1">{publishDate}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon />
                  <span className="ml-1">{readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <BookmarkIcon />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={featuredImage || "/placeholder.svg"}
            alt="Featured post illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-none">{content || defaultContent}</div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#8C1515] to-[#B83A4B] flex items-center justify-center mr-0 md:mr-6 mb-4 md:mb-0 mx-auto md:mx-0 text-white">
              <UserIcon size="w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-xl mb-3 text-gray-900">About {author}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{authorBio}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="px-4 py-2 bg-[#8C1515] text-white rounded-lg hover:bg-[#6e1010] transition-colors">
                  Follow {author}
                </button>
                <button className="px-4 py-2 border border-[#8C1515] text-[#8C1515] rounded-lg hover:bg-red-50 transition-colors">
                  More Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
