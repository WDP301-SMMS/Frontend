"use client"

import { useState } from "react"
import "./blogs.css"

export default function BlogPage() {
  // Sample blog post data - in a real application, this would come from props or an API
  const [blogPosts] = useState([
    {
      id: 1,
      title: "Advancing Research in Artificial Intelligence and Machine Learning",
      excerpt:
        "Stanford researchers are pioneering new approaches to AI that could revolutionize how we understand and interact with intelligent systems. This groundbreaking work spans multiple disciplines and promises to shape the future of technology.",
      date: "December 15, 2024",
      author: "Dr. Sarah Chen",
      category: "Research",
      image: "/placeholder.svg?height=240&width=400",
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions for the 21st Century",
      excerpt:
        "Our engineering teams are developing innovative renewable energy technologies that could transform global energy infrastructure. From solar innovations to battery storage breakthroughs, Stanford leads the way.",
      date: "December 12, 2024",
      author: "Prof. Michael Rodriguez",
      category: "Engineering",
      image: "/placeholder.svg?height=240&width=400",
    },
    {
      id: 3,
      title: "The Future of Medical Education: Virtual Reality in Healthcare Training",
      excerpt:
        "Stanford Medical School introduces cutting-edge VR technology to enhance medical training, providing students with immersive learning experiences that bridge theory and practice.",
      date: "December 10, 2024",
      author: "Dr. Emily Watson",
      category: "Medicine",
      image: "/placeholder.svg?height=240&width=400",
    },
    {
      id: 4,
      title: "Digital Humanities: Preserving Cultural Heritage Through Technology",
      excerpt:
        "Exploring how digital tools and methodologies are revolutionizing humanities research, from ancient text analysis to virtual museum experiences that make culture accessible worldwide.",
      date: "December 8, 2024",
      author: "Prof. David Kim",
      category: "Humanities",
      image: "/placeholder.svg?height=240&width=400",
    },
    {
      id: 5,
      title: "Climate Change Research: New Insights from Stanford Earth Sciences",
      excerpt:
        "Recent findings from our climate research teams reveal important patterns in global warming trends, offering new perspectives on environmental challenges and potential solutions.",
      date: "December 5, 2024",
      author: "Dr. Lisa Thompson",
      category: "Environment",
      image: "/placeholder.svg?height=240&width=400",
    },
    {
      id: 6,
      title: "Innovation in Computer Science Education",
      excerpt:
        "Stanford's Computer Science department unveils new pedagogical approaches that make programming more accessible and engaging for students from diverse backgrounds.",
      date: "December 3, 2024",
      author: "Prof. James Liu",
      category: "Education",
      image: "/placeholder.svg?height=240&width=400",
    },
  ])

  const getCategoryColor = (category) => {
    const colors = {
      Research: "bg-stanford-red-100 text-stanford-red-800",
      Engineering: "bg-blue-100 text-blue-800",
      Medicine: "bg-green-100 text-green-800",
      Humanities: "bg-purple-100 text-purple-800",
      Environment: "bg-emerald-100 text-emerald-800",
      Education: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="stanford-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="hero-title font-serif font-bold tracking-tight mb-6 stanford-text-shadow">
              Stanford Research & Innovation
            </h1>
            <p className="hero-subtitle text-stanford-red-100 max-w-3xl mx-auto leading-relaxed">
              Discover groundbreaking research, innovative discoveries, and thought leadership from Stanford
              University's world-renowned faculty and researchers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Latest Research & Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest developments in research, education, and innovation happening across
            Stanford's schools and departments.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <article className="blog-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                  <img
                    src={blogPosts[0].image || "/placeholder.svg"}
                    alt={blogPosts[0].title}
                    className="blog-image w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-8 md:w-1/2">
                <div className="mb-3">
                  <span
                    className={`category-badge inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(blogPosts[0].category)}`}
                  >
                    {blogPosts[0].category}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 hover:text-stanford-red transition-colors duration-200">
                  <a href="#" className="block stanford-focus">
                    {blogPosts[0].title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span className="font-medium">{blogPosts[0].author}</span>
                  <time dateTime={blogPosts[0].date}>{blogPosts[0].date}</time>
                </div>
                <div>
                  <a
                    href="#"
                    className="inline-flex items-center text-stanford-red font-medium hover:text-stanford-dark-red transition-colors duration-200 stanford-focus"
                  >
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.id}
              className="blog-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* Post Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="blog-image w-full h-full object-cover"
                />
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span
                    className={`category-badge inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 line-clamp-2 hover:text-stanford-red transition-colors duration-200">
                  <a href="#" className="block stanford-focus">
                    {post.title}
                  </a>
                </h3>

                {/* Post Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

                {/* Post Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{post.author}</span>
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12 no-print">
          <button className="stanford-button bg-stanford-red hover:bg-stanford-dark-red text-white font-semibold py-3 px-8 rounded-lg shadow-md">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="bg-gray-50 border-t border-gray-200 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-4">
            Stay Connected with Stanford Research
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest updates on research breakthroughs, academic achievements,
            and university news.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none stanford-focus"
            />
            <button className="stanford-button bg-stanford-red hover:bg-stanford-dark-red text-white font-semibold py-3 px-6 rounded-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
