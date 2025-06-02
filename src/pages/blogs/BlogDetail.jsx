import "./BlogDetail.css"

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
      Design: "category-design",
      Research: "category-research",
      Interviews: "category-interviews",
      Business: "category-business",
      Health: "category-health",
      Technology: "category-technology",
    }
    return colorMap[category] || "category-default"
  }

  // Custom SVG Icons
  const ArrowLeftIcon = () => (
    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12,19 5,12 12,5"></polyline>
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )

  const ClockIcon = () => (
    <svg className="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  )

  const UserIcon = ({ size = "icon-md" }) => (
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )

  const BookmarkIcon = () => (
    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )

  const ShareIcon = () => (
    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  )

  const defaultContent = (
    <div className="article-content">
      <p className="lead-paragraph">
        We sat down with London's fast-growing brand and product design studio, Makr & Co, to find out how they've used
        innovative design principles to 2x their revenue.
      </p>

      <p className="content-paragraph">
        Founded in 2019, Makr & Co has quickly become one of London's most sought-after design studios, working with
        everyone from early-stage startups to Fortune 500 companies.
      </p>

      <h2 className="content-heading">The Journey to Success</h2>

      <p className="content-paragraph">
        "When we started Makr & Co, we knew we wanted to do things differently," says Sarah Johnson, co-founder and
        Creative Director. "We weren't just interested in making things look pretty – we wanted to solve real problems
        for real people."
      </p>

      <blockquote className="content-blockquote">
        <p className="quote-text">
          "Design isn't just about aesthetics. It's about creating experiences that resonate with people on a deeper
          level."
        </p>
        <cite className="quote-cite">— Sarah Johnson, Creative Director</cite>
      </blockquote>

      <h2 className="content-heading">Key Principles</h2>

      <ul className="content-list">
        <li className="list-item">
          <span className="list-bullet"></span>
          <div>
            <strong className="list-strong">User-Centered Design:</strong> Every decision starts with understanding the
            end user's needs.
          </div>
        </li>
        <li className="list-item">
          <span className="list-bullet"></span>
          <div>
            <strong className="list-strong">Iterative Process:</strong> Continuous testing and refinement based on real
            feedback.
          </div>
        </li>
        <li className="list-item">
          <span className="list-bullet"></span>
          <div>
            <strong className="list-strong">Cross-Functional Collaboration:</strong> Designers, developers, and
            strategists work together.
          </div>
        </li>
        <li className="list-item">
          <span className="list-bullet"></span>
          <div>
            <strong className="list-strong">Data-Driven Decisions:</strong> Analytics and user research inform every
            design choice.
          </div>
        </li>
      </ul>

      <div className="stats-box">
        <h3 className="stats-title">Impact by the Numbers</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">200%</div>
            <div className="stat-label">Revenue Growth</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Successful Projects</div>
          </div>
        </div>
      </div>

      <p className="content-paragraph">
        As Makr & Co continues to grow, they're expanding their services to include strategic consulting and design
        systems development. "We're not just designing products anymore," explains Johnson. "We're helping companies
        build design cultures that can scale."
      </p>
    </div>
  )

  return (
    <div className="blog-post">
      {/* Back Navigation */}
      <div className="back-nav">
        <button className="back-button">
          <ArrowLeftIcon />
          <span>Back to blog</span>
        </button>
      </div>

      {/* Article Content */}
      <article className="article">
        {/* Categories */}
        <div className="article-categories">
          {categories.map((category, index) => (
            <span key={index} className={`category-tag ${getCategoryColor(category)}`}>
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="article-title">{title}</h1>

        {/* Author and Meta */}
        <div className="article-header">
          <div className="author-info">
            <div className="author-avatar">
              <UserIcon size="icon-md" />
            </div>
            <div className="author-details">
              <p className="author-name">{author}</p>
              <div className="article-meta">
                <div className="meta-item">
                  <CalendarIcon />
                  <span>{publishDate}</span>
                </div>
                <div className="meta-item">
                  <ClockIcon />
                  <span>{readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="article-actions">
            <button className="action-button">
              <BookmarkIcon />
            </button>
            <button className="action-button">
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="featured-image">
          <img src={featuredImage || "/placeholder.svg"} alt="Featured post illustration" className="featured-img" />
        </div>

        {/* Content */}
        <div className="article-body">{content || defaultContent}</div>

        {/* Author Bio */}
        <div className="author-bio">
          <div className="bio-content">
            <div className="bio-avatar">
              <UserIcon size="icon-lg" />
            </div>
            <div className="bio-text">
              <h3 className="bio-title">About {author}</h3>
              <p className="bio-description">{authorBio}</p>
              <div className="bio-actions">
                <button className="bio-button-primary">Follow {author}</button>
                <button className="bio-button-secondary">More Articles</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
