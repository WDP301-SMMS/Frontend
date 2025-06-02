"use client"

import { useState } from "react"
import "./Blogs.css"

export default function BlogPage() {
  // Sample blog post data - in a real application, this would come from props or an API
  const [blogPosts] = useState([
    {
      id: 1,
      title: "Advancing Research in Artificial Intelligence and Machine Learning",
      excerpt:
        "Stanford researchers are pioneering new approaches to AI that could revolutionize how we understand and interact with intelligent systems. This groundbreaking work spans multiple disciplines and promises to shape the future of technology.",
      content: `
        <p>Stanford University continues to lead the world in artificial intelligence and machine learning research, with groundbreaking discoveries that are reshaping our understanding of intelligent systems. Our interdisciplinary approach brings together experts from computer science, neuroscience, psychology, and engineering to tackle the most challenging problems in AI.</p>
        
        <h2>Revolutionary Neural Network Architectures</h2>
        <p>Our research teams have developed novel neural network architectures that demonstrate unprecedented performance in natural language processing and computer vision tasks. These innovations are not just academic exercises—they have real-world applications that are already being deployed in industry.</p>
        
        <h2>Ethical AI Development</h2>
        <p>Stanford's commitment to responsible AI development ensures that our research considers the broader implications of artificial intelligence on society. We're developing frameworks for ethical AI that prioritize fairness, transparency, and human welfare.</p>
        
        <h2>Future Directions</h2>
        <p>Looking ahead, our research will focus on creating AI systems that can learn more efficiently, reason about complex problems, and collaborate effectively with humans. The future of AI is bright, and Stanford is leading the way.</p>
      `,
      date: "December 15, 2024",
      author: "Dr. Sarah Chen",
      authorBio:
        "Dr. Sarah Chen is a Professor of Computer Science at Stanford University, specializing in artificial intelligence and machine learning. She has published over 100 papers and leads the AI Ethics Initiative.",
      category: "Research",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "8 min read",
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions for the 21st Century",
      excerpt:
        "Our engineering teams are developing innovative renewable energy technologies that could transform global energy infrastructure. From solar innovations to battery storage breakthroughs, Stanford leads the way.",
      content: `
        <p>The transition to sustainable energy is one of the most critical challenges of our time. Stanford's engineering teams are at the forefront of developing innovative solutions that promise to transform how we generate, store, and distribute energy.</p>
        
        <h2>Next-Generation Solar Technology</h2>
        <p>Our researchers have achieved breakthrough efficiency rates in perovskite solar cells, potentially making solar energy more affordable and accessible than ever before. These advances could revolutionize the solar industry.</p>
        
        <h2>Advanced Battery Storage</h2>
        <p>Stanford's battery research focuses on developing safer, more efficient, and longer-lasting energy storage solutions. Our work on solid-state batteries could enable the widespread adoption of electric vehicles and grid-scale energy storage.</p>
      `,
      date: "December 12, 2024",
      author: "Prof. Michael Rodriguez",
      authorBio:
        "Prof. Michael Rodriguez leads Stanford's Sustainable Energy Initiative and has been instrumental in developing next-generation renewable energy technologies.",
      category: "Engineering",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "The Future of Medical Education: Virtual Reality in Healthcare Training",
      excerpt:
        "Stanford Medical School introduces cutting-edge VR technology to enhance medical training, providing students with immersive learning experiences that bridge theory and practice.",
      content: `
        <p>Medical education is undergoing a revolutionary transformation with the integration of virtual reality technology. Stanford Medical School is pioneering the use of VR to create immersive learning experiences that prepare the next generation of healthcare professionals.</p>
        
        <h2>Immersive Surgical Training</h2>
        <p>Our VR surgical simulators allow students to practice complex procedures in a risk-free environment, building confidence and skills before entering the operating room.</p>
        
        <h2>Patient Interaction Scenarios</h2>
        <p>VR technology enables students to practice patient interactions and develop empathy through realistic scenarios that would be difficult to replicate in traditional training.</p>
      `,
      date: "December 10, 2024",
      author: "Dr. Emily Watson",
      authorBio:
        "Dr. Emily Watson is the Director of Medical Education Innovation at Stanford Medical School, focusing on integrating technology into medical training.",
      category: "Medicine",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "5 min read",
    },
    {
      id: 4,
      title: "Digital Humanities: Preserving Cultural Heritage Through Technology",
      excerpt:
        "Exploring how digital tools and methodologies are revolutionizing humanities research, from ancient text analysis to virtual museum experiences that make culture accessible worldwide.",
      content: `
        <p>The digital humanities represent a fascinating intersection of technology and traditional humanistic inquiry. Stanford's digital humanities initiatives are preserving cultural heritage and making it accessible to global audiences.</p>
        
        <h2>Ancient Text Analysis</h2>
        <p>Using machine learning algorithms, we're uncovering new insights from ancient texts and manuscripts, revealing patterns and connections that were previously invisible to human scholars.</p>
        
        <h2>Virtual Cultural Experiences</h2>
        <p>Our virtual museum projects allow people worldwide to experience cultural artifacts and historical sites in unprecedented detail, democratizing access to cultural heritage.</p>
      `,
      date: "December 8, 2024",
      author: "Prof. David Kim",
      authorBio:
        "Prof. David Kim directs Stanford's Digital Humanities Lab and specializes in computational approaches to cultural analysis.",
      category: "Humanities",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "Climate Change Research: New Insights from Stanford Earth Sciences",
      excerpt:
        "Recent findings from our climate research teams reveal important patterns in global warming trends, offering new perspectives on environmental challenges and potential solutions.",
      content: `
        <p>Stanford's Earth Sciences department continues to provide crucial insights into climate change, using advanced modeling techniques and field research to understand our changing planet.</p>
        
        <h2>Advanced Climate Modeling</h2>
        <p>Our researchers have developed sophisticated climate models that provide more accurate predictions of future climate scenarios, helping policymakers make informed decisions.</p>
        
        <h2>Ocean-Atmosphere Interactions</h2>
        <p>New research reveals complex interactions between ocean currents and atmospheric patterns, providing insights into how climate systems respond to changing conditions.</p>
      `,
      date: "December 5, 2024",
      author: "Dr. Lisa Thompson",
      authorBio:
        "Dr. Lisa Thompson is a leading climate scientist at Stanford, specializing in ocean-atmosphere interactions and climate modeling.",
      category: "Environment",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "9 min read",
    },
    {
      id: 6,
      title: "Innovation in Computer Science Education",
      excerpt:
        "Stanford's Computer Science department unveils new pedagogical approaches that make programming more accessible and engaging for students from diverse backgrounds.",
      content: `
        <p>Computer science education is evolving to meet the needs of an increasingly diverse student body. Stanford's CS department is pioneering new approaches to make programming more accessible and engaging.</p>
        
        <h2>Inclusive Curriculum Design</h2>
        <p>Our new curriculum emphasizes real-world applications and collaborative learning, helping students from all backgrounds succeed in computer science.</p>
        
        <h2>Interactive Learning Platforms</h2>
        <p>We've developed innovative online platforms that provide personalized learning experiences, adapting to each student's pace and learning style.</p>
      `,
      date: "December 3, 2024",
      author: "Prof. James Liu",
      authorBio:
        "Prof. James Liu leads educational innovation in Stanford's Computer Science department, focusing on inclusive and accessible CS education.",
      category: "Education",
      image: "/placeholder.svg?height=240&width=400",
      readTime: "4 min read",
    },
  ])

  const [currentPage, setCurrentPage] = useState("listing")
  const [selectedPost, setSelectedPost] = useState(null)

  const getCategoryColor = (category) => {
    const colors = {
      Research: "category-research",
      Engineering: "category-engineering",
      Medicine: "category-medicine",
      Humanities: "category-humanities",
      Environment: "category-environment",
      Education: "category-education",
    }
    return colors[category] || "category-default"
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setCurrentPage("detail")
    // In a real application, you would use React Router or Next.js router
    // window.history.pushState({}, '', `/blog-detail/${post.id}`)
  }

  const handleBackToListing = () => {
    setCurrentPage("listing")
    setSelectedPost(null)
    // window.history.pushState({}, '', '/blogs')
  }

  // Blog Detail Page Component
  const BlogDetailPage = ({ post, onBack }) => (
    <div className="blog-detail-page">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={onBack} className="back-button">
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Article Content */}
      <article className="blog-detail-article">
        {/* Categories */}
        <div className="article-categories">
          <span className={`category-badge ${getCategoryColor(post.category)}`}>{post.category}</span>
        </div>

        {/* Title */}
        <h1 className="article-title">{post.title}</h1>

        {/* Author and Meta Information */}
        <div className="article-meta">
          <div className="author-info">
            <div className="author-avatar">
              <svg className="author-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="author-details">
              <p className="author-name">{post.author}</p>
              <div className="meta-items">
                <span className="meta-item">
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {post.date}
                </span>
                <span className="meta-item">
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="article-image">
          <img src={post.image || "/placeholder.svg"} alt={post.title} />
        </div>

        {/* Content */}
        <div className="article-content">
          <div className="article-excerpt">{post.excerpt}</div>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Author Bio */}
        <div className="author-bio">
          <div className="author-bio-content">
            <div className="author-bio-avatar">
              <svg className="author-bio-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="author-bio-text">
              <h3 className="author-bio-title">About {post.author}</h3>
              <p className="author-bio-description">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )

  // Blog Listing Page Component
  const BlogListingPage = () => (
    <div className="blog-listing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Stanford Research & Innovation</h1>
            <p className="hero-subtitle">
              Discover groundbreaking research, innovative discoveries, and thought leadership from Stanford
              University's world-renowned faculty and researchers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Latest Research & Stories</h2>
          <p className="section-description">
            Stay informed about the latest developments in research, education, and innovation happening across
            Stanford's schools and departments.
          </p>
        </div>

        {/* Featured Post */}
        <div className="featured-post-section">
          <article className="featured-post" onClick={() => handlePostClick(blogPosts[0])}>
            <div className="featured-post-layout">
              <div className="featured-post-image">
                <img src={blogPosts[0].image || "/placeholder.svg"} alt={blogPosts[0].title} className="post-image" />
              </div>
              <div className="featured-post-content">
                <div className="post-category">
                  <span className={`category-badge ${getCategoryColor(blogPosts[0].category)}`}>
                    {blogPosts[0].category}
                  </span>
                </div>
                <h3 className="post-title">{blogPosts[0].title}</h3>
                <p className="post-excerpt">{blogPosts[0].excerpt}</p>
                <div className="post-meta">
                  <span className="post-author">{blogPosts[0].author}</span>
                  <time className="post-date">{blogPosts[0].date}</time>
                </div>
                <div className="read-more">
                  <span>Read more</span>
                  <svg className="read-more-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Blog Posts Grid */}
        <div className="posts-grid">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="grid-post" onClick={() => handlePostClick(post)}>
              {/* Post Image */}
              <div className="grid-post-image">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />
              </div>

              {/* Post Content */}
              <div className="grid-post-content">
                {/* Category Badge */}
                <div className="post-category">
                  <span className={`category-badge ${getCategoryColor(post.category)}`}>{post.category}</span>
                </div>

                {/* Post Title */}
                <h3 className="grid-post-title">{post.title}</h3>

                {/* Post Excerpt */}
                <p className="grid-post-excerpt">{post.excerpt}</p>

                {/* Post Meta */}
                <div className="grid-post-meta">
                  <span className="post-author">{post.author}</span>
                  <time className="post-date">{post.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="load-more-section">
          <button className="load-more-button">Load More Articles</button>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <h3 className="newsletter-title">Stay Connected with Stanford Research</h3>
          <p className="newsletter-description">
            Subscribe to our newsletter to receive the latest updates on research breakthroughs, academic achievements,
            and university news.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" className="newsletter-input" />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )

  // Main render logic
  if (currentPage === "detail" && selectedPost) {
    return <BlogDetailPage post={selectedPost} onBack={handleBackToListing} />
  }

  return <BlogListingPage />
}
