export default function BlogPost({
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
    const colorMap = {
      Design: "bg-blue-100 text-blue-800",
      Research: "bg-green-100 text-green-800",
      Interviews: "bg-purple-100 text-purple-800",
      Business: "bg-yellow-100 text-yellow-800",
      Health: "bg-red-100 text-red-800",
      Technology: "bg-indigo-100 text-indigo-800",
    }
    return colorMap[category] || "bg-gray-100 text-gray-800"
  }

  // Custom SVG Icons
  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12,19 5,12 12,5"></polyline>
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )

  const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )

  const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  )

  const defaultContent = (
    <div className="space-y-6">
      <p className="text-xl leading-relaxed text-gray-700">
        We sat down with London's fast-growing brand and product design studio, Makr & Co, to find out how they've used
        innovative design principles to 2x their revenue.
      </p>

      <p className="text-base leading-relaxed text-gray-700">
        Founded in 2019, Makr & Co has quickly become one of London's most sought-after design studios, working with
        everyone from early-stage startups to Fortune 500 companies.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Journey to Success</h2>

      <p className="text-base leading-relaxed text-gray-700">
        "When we started Makr & Co, we knew we wanted to do things differently," says Sarah Johnson, co-founder and
        Creative Director. "We weren't just interested in making things look pretty – we wanted to solve real problems
        for real people."
      </p>

      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6">
        <p className="text-lg italic text-gray-800">
          "Design isn't just about aesthetics. It's about creating experiences that resonate with people on a deeper
          level."
        </p>
        <cite className="block text-gray-600 mt-2">— Sarah Johnson, Creative Director</cite>
      </blockquote>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Principles</h2>

      <ul className="list-none space-y-4">
        <li className="flex items-start">
          <span className="w-2 h-2 mr-3 mt-1 bg-gray-500 rounded-full flex-shrink-0"></span>
          <div>
            <strong className="font-semibold text-gray-900">User-Centered Design:</strong> Every decision starts with understanding the
            end user's needs.
          </div>
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 mr-3 mt-1 bg-gray-500 rounded-full flex-shrink-0"></span>
          <div>
            <strong className="font-semibold text-gray-900">Iterative Process:</strong> Continuous testing and refinement based on real
            feedback.
          </div>
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 mr-3 mt-1 bg-gray-500 rounded-full flex-shrink-0"></span>
          <div>
            <strong className="font-semibold text-gray-900">Cross-Functional Collaboration:</strong> Designers, developers, and
            strategists work together.
          </div>
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 mr-3 mt-1 bg-gray-500 rounded-full flex-shrink-0"></span>
          <div>
            <strong className="font-semibold text-gray-900">Data-Driven Decisions:</strong> Analytics and user research inform every
            design choice.
          </div>
        </li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm my-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Impact by the Numbers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-600">200%</div>
            <div className="text-gray-600 mt-1">Revenue Growth</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-indigo-600">50+</div>
            <div className="text-gray-600 mt-1">Successful Projects</div>
          </div>
        </div>
      </div>

      <p className="text-base leading-relaxed text-gray-700">
        As Makr & Co continues to grow, they're expanding their services to include strategic consulting and design
        systems development. "We're not just designing products anymore," explains Johnson. "We're helping companies
        build design cultures that can scale."
      </p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-8">
        <button className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
          <ArrowLeftIcon />
          <span className="ml-2 font-medium">Back to blog</span>
        </button>
      </div>

      {/* Article Content */}
      <article className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category, index) => (
            <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(category)}`}>
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">{title}</h1>

        {/* Author and Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <UserIcon size="w-10 h-10 text-gray-500" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900">{author}</p>
              <div className="flex items-center text-gray-500 text-sm space-x-4">
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

          <div className="flex space-x-3">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200">
              <BookmarkIcon />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200">
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-md">
          <img src={featuredImage || "/placeholder.svg"} alt="Featured post illustration" className="w-full h-auto object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
            {content || defaultContent}
        </div>


        {/* Author Bio */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gray-50 p-6 rounded-lg mt-12 shadow-sm">
          <div className="flex-shrink-0">
            <UserIcon size="w-16 h-16 text-gray-500" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">About {author}</h3>
            <p className="text-gray-700 mb-4">{authorBio}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md">
                Follow {author}
              </button>
              <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
                More Articles
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}