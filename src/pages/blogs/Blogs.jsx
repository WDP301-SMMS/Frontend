"use client"

import { useState } from "react"
import Footer from "~/libs/components/layout/Footer"
import Header from "~/libs/components/layout/Header"

export default function BlogPage() {
  // Sample blog post data - in a real application, this would come from props or an API
  const [blogPosts] = useState(
   [
  {
    "id": 1,
    "title": "Advancing School Mental Health: New Research from the University of Medicine and Pharmacy, HCMC",
    "excerpt": "Researchers at the University of Medicine and Pharmacy, HCMC, are pioneering new approaches to support mental health for students. This groundbreaking work promises to shape the future of school health.",
    "content": "<p>The University of Medicine and Pharmacy, HCMC, continues to lead in school health research, with groundbreaking discoveries that are reshaping our understanding and support of student well-being. Our interdisciplinary approach brings together experts from psychiatry, pediatrics, sociology, and education to tackle the most challenging problems in school health.</p><h2>Revolutionary Psychological Intervention Programs</h2><p>Our research teams have developed novel psychological intervention programs that demonstrate unprecedented effectiveness in reducing stress, anxiety, and depression in students. These innovations are not just academic exercises—they have real-world applications already being deployed in schools.</p><h2>Responsible School Health Development</h2><p>The University of Medicine and Pharmacy, HCMC's commitment to responsible school health development ensures that our research considers the broader implications of school health on society. We're developing frameworks for ethical school health that prioritize fairness, transparency, and student welfare.</p><h2>Future Directions</h2><p>Looking ahead, our research will focus on creating mental health support systems that can learn more efficiently, reason about complex problems, and collaborate effectively with schools. The future of school health is bright, and the University of Medicine and Pharmacy, HCMC, is leading the way.</p>",
    "date": "December 15, 2024",
    "author": "Dr. Nguyen Thi Thu Ha",
    "authorBio": "Dr. Nguyen Thi Thu Ha is the Head of the Public Health Department at the University of Medicine and Pharmacy, HCMC, specializing in school mental health. She has published over 50 papers and leads the School Health Ethics Initiative.",
    "category": "School Mental Health",
    "image": "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/10/5/base64-17281100442951974649453.jpeg",
    "readTime": "8 min read"
  },
  {
    "id": 2,
    "title": "Sustainable Nutrition Solutions for 21st-Century Schools",
    "excerpt": "Our research teams are developing innovative nutritional technologies that could transform global school food infrastructure. From school meal innovations to breakthrough food storage solutions, the University of Medicine and Pharmacy, HCMC, leads the way.",
    "content": "<p>The transition to sustainable nutrition is one of the most critical challenges of our time. The University of Medicine and Pharmacy, HCMC's research teams are at the forefront of developing innovative solutions that promise to transform how we produce, store, and distribute food in school environments.</p><h2>Next-Generation School Meal Technology</h2><p>Our researchers have achieved breakthrough efficiency rates in optimizing school meal compositions, potentially making nutritious food more affordable and accessible than ever before. These advances could revolutionize the school food industry.</p><h2>Advanced Food Storage</h2><p>The University of Medicine and Pharmacy, HCMC's nutrition research focuses on developing safer, more efficient, and longer-lasting food storage solutions. Our work on advanced food management systems could enable the widespread adoption of healthy meal programs and reduce food waste.</p>",
    "date": "December 12, 2024",
    "author": "Assoc. Prof. Dr. Le Van Hung",
    "authorBio": "Assoc. Prof. Dr. Le Van Hung leads the Sustainable Nutrition Initiative at the University of Medicine and Pharmacy, HCMC, and has been instrumental in developing next-generation school nutritional technologies.",
    "category": "School Nutrition",
    "image": "https://cdn.nhandan.vn/images/7981b22431e151580ca63764f1bdbd8b617c91e62f8f5479a738d7b784cc313f41741c1de692138f8182e84adb16fc2e/tr1-so-23.jpg",
    "readTime": "6 min read"
  },
  {
    "id": 3,
    "title": "The Future of Medical Education: Virtual Reality in School Healthcare Training",
    "excerpt": "The University of Medicine and Pharmacy, HCMC, introduces cutting-edge VR technology to enhance medical training, providing students with immersive learning experiences that bridge theory and practice in school healthcare.",
    "content": "<p>Medical education is undergoing a revolutionary transformation with the integration of virtual reality technology. The University of Medicine and Pharmacy, HCMC, is pioneering the use of VR to create immersive learning experiences that prepare the next generation of healthcare professionals for school settings.</p><h2>Immersive School Healthcare Training</h2><p>Our VR school healthcare simulators allow students to practice complex procedures in a risk-free environment, building confidence and skills before engaging with real-world scenarios.</p><h2>Student Interaction Scenarios</h2><p>VR technology enables students to practice interactions with students and develop empathy through realistic scenarios that would be difficult to replicate in traditional training.</p>",
    "date": "December 10, 2024",
    "author": "Dr. Pham Thi Mai",
    "authorBio": "Dr. Pham Thi Mai is the Director of Medical Education Innovation at the University of Medicine and Pharmacy, HCMC, focusing on integrating technology into school healthcare training.",
    "category": "School Healthcare Education",
    "image": "https://vr360.com.vn/uploads/images/thuc-te-ao-trong-giao-duc-dai-hoc-2.png",
    "readTime": "5 min read"
  },
  {
    "id": 4,
    "title": "Digital School Health: Preserving Community Health Heritage Through Technology",
    "excerpt": "Exploring how digital tools and methodologies are revolutionizing school health research, from student health data analysis to virtual school health experiences that make health accessible worldwide.",
    "content": "<p>Digital school health represents a fascinating intersection of technology and traditional health inquiry in educational settings. The University of Medicine and Pharmacy, HCMC's digital school health initiatives are preserving community health heritage and making it accessible to global audiences.</p><h2>Student Health Data Analysis</h2><p>Using machine learning algorithms, we're uncovering new insights from student health data and records, revealing patterns and connections that were previously invisible to human scholars.</p><h2>Virtual School Health Experiences</h2><p>Our virtual school health projects allow people worldwide to experience health insights and historical medical information in unprecedented detail, democratizing access to community health heritage.</p>",
    "date": "December 8, 2024",
    "author": "Dr. Tran Minh Duc",
    "authorBio": "Dr. Tran Minh Duc directs the Digital School Health Lab at the University of Medicine and Pharmacy, HCMC, and specializes in computational approaches to school health analysis.",
    "category": "Digital School Health",
    "image": "https://hnm.1cdn.vn/2022/09/05/hanoimoi.com.vn-uploads-images-tuandiep-2022-09-05-_hoi-chu-thap-do-thanh-pho-ha-noi-phoi-hop-voi-cac-co-so-y-te-to-chuc-tu-van-kham-suc-khoe-cho-nguoi-dan-tren-dia-ban-huyen-soc-son..jpg",
    "readTime": "7 min read"
  },
  {
    "id": 5,
    "title": "School Environmental Health Research: New Insights from the Department of Public Health",
    "excerpt": "Recent findings from our school environmental health research teams reveal important patterns in global public health trends, offering new perspectives on environmental challenges within educational settings and potential solutions.",
    "content": "<p>The Department of Public Health at the University of Medicine and Pharmacy, HCMC, continues to provide crucial insights into school environmental health, using advanced modeling techniques and field research to understand our changing educational environments.</p><h2>Advanced School Environmental Modeling</h2><p>Our researchers have developed sophisticated school environmental models that provide more accurate predictions of future health scenarios, helping policymakers make informed decisions for school settings.</p><h2>Student-Environment Interactions</h2><p>New research reveals complex interactions between student behavior and environmental factors, providing insights into how school health systems respond to changing conditions.</p>",
    "date": "December 5, 2024",
    "author": "Dr. Do Thi Thanh",
    "authorBio": "Dr. Do Thi Thanh is a leading environmental health scientist at the University of Medicine and Pharmacy, HCMC, specializing in student-environment interactions and school environmental modeling.",
    "category": "School Environmental Health",
    "image": "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/2/10/cham-soc-suc-khoe-h0c-duong-giai-doan-2021-2025-toan-dein-ca-the-chat-va-tinh-than-10-16444942939681106351987.jpg",
    "readTime": "9 min read"
  },
  {
    "id": 6,
    "title": "Innovation in School Health Education",
    "excerpt": "The Public Health Department at the University of Medicine and Pharmacy, HCMC, unveils new pedagogical approaches that make health education more accessible and engaging for students from diverse backgrounds.",
    "content": "<p>School health education is evolving to meet the needs of an increasingly diverse student body. The Public Health Department at the University of Medicine and Pharmacy, HCMC, is pioneering new approaches to make health education more accessible and engaging.</p><h2>Inclusive Curriculum Design</h2><p>Our new curriculum emphasizes real-world applications and collaborative learning, helping students from all backgrounds succeed in school health education.</p><h2>Interactive Learning Platforms</h2><p>We've developed innovative online platforms that provide personalized learning experiences, adapting to each student's pace and learning style.</p>",
    "date": "December 3, 2024",
    "author": "Assoc. Prof. Dr. Hoang Thi Lan",
    "authorBio": "Assoc. Prof. Dr. Hoang Thi Lan leads educational innovation in the Public Health Department at the University of Medicine and Pharmacy, HCMC, focusing on inclusive and accessible school health education.",
    "category": "School Health Education",
    "image": "https://cdn.thuvienphapluat.vn/uploads/tintuc/2024/09/07/thuc-hien-chuong-trinh-suc-khoe-hoc-duong.jpg",
    "readTime": "4 min read"
  }
]
)

  const [currentPage, setCurrentPage] = useState("listing")
  const [selectedPost, setSelectedPost] = useState(null)

  const getCategoryStyles = (category) => {
    const styles = {
      Research: "bg-blue-100 text-blue-800",
      Engineering: "bg-indigo-100 text-indigo-800",
      Medicine: "bg-green-100 text-green-800",
      Humanities: "bg-purple-100 text-purple-800",
      Environment: "bg-emerald-100 text-emerald-800",
      Education: "bg-orange-100 text-orange-800",
    }
    return styles[category] || "bg-gray-100 text-gray-800"
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setCurrentPage("detail")
  }

  const handleBackToListing = () => {
    setCurrentPage("listing")
    setSelectedPost(null)
  }

  // Blog Detail Page Component
  const BlogDetailPage = ({ post, onBack }) => (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={onBack} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 font-serif">
          {post.title}
        </h1>

        {/* Author and Meta Information */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-4 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="max-w-none">
          <div className="text-xl text-gray-600 leading-relaxed font-light mb-8">
            {post.excerpt}
          </div>
          <div 
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/<h2>/g, '<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 font-serif">').replace(/<p>/g, '<p class="mb-6">') }} 
          />
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4 md:mr-6 md:mb-0 text-white mx-auto md:mx-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl mb-3 text-gray-900">About {post.author}</h3>
              <p className="text-gray-600 leading-relaxed">{post.authorBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Blog Listing Page Component
  const BlogListingPage = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5"></div>
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 lg:py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-serif" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Stanford Research & Innovation
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover groundbreaking research, innovative discoveries, and thought leadership from Stanford
              University's world-renowned faculty and researchers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif">
            Latest Research & Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest developments in research, education, and innovation happening across
            Stanford's schools and departments.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => handlePostClick(blogPosts[0])}
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 aspect-video md:w-1/2 md:aspect-auto overflow-hidden">
                <img 
                  src={blogPosts[0].image || "/placeholder.svg"} 
                  alt={blogPosts[0].title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
              <div className="p-8 flex-1 md:w-1/2">
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(blogPosts[0].category)}`}>
                    {blogPosts[0].category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif transition-colors hover:text-blue-600">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
                  <span className="font-medium">{blogPosts[0].author}</span>
                  <time>{blogPosts[0].date}</time>
                </div>
                <div className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  <span>Read more</span>
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => handlePostClick(post)}
            >
              {/* Post Image */}
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image || "/placeholder.svg"} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-serif line-clamp-2 transition-colors hover:text-blue-600">
                  {post.title}
                </h3>

                {/* Post Excerpt */}
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>

                {/* Post Meta */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="font-medium">{post.author}</span>
                  <time>{post.date}</time>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Load More Articles
          </button>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-serif">
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
            />
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Main render logic
  if (currentPage === "detail" && selectedPost) {
    return <BlogDetailPage post={selectedPost} onBack={handleBackToListing} />
  }

  return (
    <>
    <Header />
    <BlogListingPage />
    <Footer/>
    </>
  )
}