"use client"

import { useState } from "react"
import "./Profile.css"

// Custom SVG icons to avoid external dependencies
const Icons = {
  User: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Bell: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Shield: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Brush: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  Globe: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Help: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Menu: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronDown: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
}

// Navigation items configuration
const navigationItems = [
  {
    id: "profile",
    title: "Profile",
    icon: Icons.User,
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Icons.Bell,
  },
  {
    id: "security",
    title: "Security",
    icon: Icons.Shield,
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Icons.Brush,
  },
  {
    id: "language",
    title: "Language & Region",
    icon: Icons.Globe,
  },
  {
    id: "help",
    title: "Help & Support",
    icon: Icons.Help,
  },
]

// Custom Toggle Switch Component
function ToggleSwitch({ checked = false, onChange, disabled = false, id }) {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
        disabled={disabled}
        className="toggle-input"
      />
      <label
        htmlFor={id}
        className={`toggle-label ${checked ? "toggle-active" : ""} ${disabled ? "toggle-disabled" : ""}`}
      >
        <span className="sr-only">{checked ? "Enabled" : "Disabled"}</span>
        <span className={`toggle-switch ${checked ? "toggle-switch-active" : ""}`} />
      </label>
    </div>
  )
}

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder, id, label }) {
  return (
    <div className="select-container">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="select-wrapper">
        <select id={id} value={value} onChange={(e) => onChange && onChange(e.target.value)} className="select-input">
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icons.ChevronDown className="select-icon" />
      </div>
    </div>
  )
}

// Custom Input Component
function CustomInput({ type = "text", id, value, onChange, placeholder, label }) {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  )
}

// Custom Textarea Component
function CustomTextarea({ id, value, onChange, placeholder, label, rows = 3 }) {
  return (
    <div className="textarea-container">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
      />
    </div>
  )
}

// Card Component
function Card({ title, description, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {(title || description) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}

// Toggle Item Component
function ToggleItem({ title, description, checked, onChange, id }) {
  return (
    <div className="toggle-item">
      <div className="toggle-item-content">
        <h4 className="toggle-item-title">{title}</h4>
        <p className="toggle-item-description">{description}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} />
    </div>
  )
}

// Button Component
function Button({ children, variant = "primary", onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`button button-${variant} ${className}`}>
      {children}
    </button>
  )
}

// Profile Section Component
function ProfileSection() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@stanford.edu",
    bio: "",
    department: "computer-science",
    publicProfile: true,
    showEmail: false,
    showDepartment: true,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const departmentOptions = [
    { value: "computer-science", label: "Computer Science" },
    { value: "engineering", label: "Engineering" },
    { value: "medicine", label: "Medicine" },
    { value: "business", label: "Business" },
    { value: "law", label: "Law" },
  ]

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Profile Settings</h2>
        <p className="section-description">Manage your personal information and preferences.</p>
      </div>

      <Card title="Personal Information" description="Update your basic profile details">
        <div className="form-grid">
          <div className="form-row">
            <CustomInput
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={(value) => handleInputChange("firstName", value)}
              placeholder="Enter your first name"
            />
            <CustomInput
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => handleInputChange("lastName", value)}
              placeholder="Enter your last name"
            />
          </div>

          <CustomInput
            id="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="Enter your email"
          />

          <CustomTextarea
            id="bio"
            label="Bio"
            value={formData.bio}
            onChange={(value) => handleInputChange("bio", value)}
            placeholder="Tell us about yourself"
          />

          <CustomSelect
            id="department"
            label="Department"
            value={formData.department}
            onChange={(value) => handleInputChange("department", value)}
            options={departmentOptions}
            placeholder="Select your department"
          />
        </div>
      </Card>

      <Card title="Profile Visibility" description="Control who can see your profile information">
        <div className="toggle-list">
          <ToggleItem
            id="publicProfile"
            title="Public Profile"
            description="Make your profile visible to other Stanford community members"
            checked={formData.publicProfile}
            onChange={(checked) => handleInputChange("publicProfile", checked)}
          />

          <ToggleItem
            id="showEmail"
            title="Show Email"
            description="Display your email address on your public profile"
            checked={formData.showEmail}
            onChange={(checked) => handleInputChange("showEmail", checked)}
          />

          <ToggleItem
            id="showDepartment"
            title="Show Department"
            description="Display your department affiliation"
            checked={formData.showDepartment}
            onChange={(checked) => handleInputChange("showDepartment", checked)}
          />
        </div>
      </Card>

      <div className="form-actions">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  )
}

// Notifications Section Component
function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    assignmentReminders: true,
    eventInvitations: false,
    weeklyDigest: true,
    urgentMessages: true,
    meetingReminders: true,
    gradeUpdates: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    frequency: "immediate",
  })

  const handleNotificationChange = (field, value) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const timeOptions = [
    { value: "20:00", label: "8:00 PM" },
    { value: "21:00", label: "9:00 PM" },
    { value: "22:00", label: "10:00 PM" },
    { value: "23:00", label: "11:00 PM" },
    { value: "06:00", label: "6:00 AM" },
    { value: "07:00", label: "7:00 AM" },
    { value: "08:00", label: "8:00 AM" },
    { value: "09:00", label: "9:00 AM" },
  ]

  const frequencyOptions = [
    { value: "immediate", label: "Immediate" },
    { value: "hourly", label: "Hourly Digest" },
    { value: "daily", label: "Daily Digest" },
    { value: "weekly", label: "Weekly Digest" },
  ]

  return (
    <div className="notifications-section">
      <div className="section-header">
        <h2 className="section-title">Notification Settings</h2>
        <p className="section-description">Choose how you want to be notified about updates and activities.</p>
      </div>

      <Card title="Email Notifications" description="Manage your email notification preferences">
        <div className="toggle-list">
          <ToggleItem
            id="courseUpdates"
            title="Course Updates"
            description="Receive notifications about course announcements and updates"
            checked={notifications.courseUpdates}
            onChange={(checked) => handleNotificationChange("courseUpdates", checked)}
          />

          <ToggleItem
            id="assignmentReminders"
            title="Assignment Reminders"
            description="Get reminders about upcoming assignment deadlines"
            checked={notifications.assignmentReminders}
            onChange={(checked) => handleNotificationChange("assignmentReminders", checked)}
          />

          <ToggleItem
            id="eventInvitations"
            title="Event Invitations"
            description="Receive invitations to campus events and activities"
            checked={notifications.eventInvitations}
            onChange={(checked) => handleNotificationChange("eventInvitations", checked)}
          />

          <ToggleItem
            id="weeklyDigest"
            title="Weekly Digest"
            description="Get a weekly summary of your activities and updates"
            checked={notifications.weeklyDigest}
            onChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
          />
        </div>
      </Card>

      <Card title="Push Notifications" description="Control mobile and desktop push notifications">
        <div className="toggle-list">
          <ToggleItem
            id="urgentMessages"
            title="Urgent Messages"
            description="Receive push notifications for urgent messages"
            checked={notifications.urgentMessages}
            onChange={(checked) => handleNotificationChange("urgentMessages", checked)}
          />

          <ToggleItem
            id="meetingReminders"
            title="Meeting Reminders"
            description="Get notified 15 minutes before scheduled meetings"
            checked={notifications.meetingReminders}
            onChange={(checked) => handleNotificationChange("meetingReminders", checked)}
          />

          <ToggleItem
            id="gradeUpdates"
            title="Grade Updates"
            description="Receive notifications when grades are posted"
            checked={notifications.gradeUpdates}
            onChange={(checked) => handleNotificationChange("gradeUpdates", checked)}
          />
        </div>
      </Card>

      <Card title="Notification Schedule" description="Set quiet hours and notification frequency">
        <div className="form-grid">
          <div className="form-row">
            <CustomSelect
              id="quietHoursStart"
              label="Quiet Hours Start"
              value={notifications.quietHoursStart}
              onChange={(value) => handleNotificationChange("quietHoursStart", value)}
              options={timeOptions.slice(0, 4)}
            />
            <CustomSelect
              id="quietHoursEnd"
              label="Quiet Hours End"
              value={notifications.quietHoursEnd}
              onChange={(value) => handleNotificationChange("quietHoursEnd", value)}
              options={timeOptions.slice(4)}
            />
          </div>

          <CustomSelect
            id="frequency"
            label="Notification Frequency"
            value={notifications.frequency}
            onChange={(value) => handleNotificationChange("frequency", value)}
            options={frequencyOptions}
          />
        </div>
      </Card>

      <div className="form-actions">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  )
}

// Placeholder Section Component
function PlaceholderSection({ title }) {
  return (
    <div className="placeholder-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-description">This section is coming soon.</p>
      </div>

      <Card>
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <div className="placeholder-icon-inner"></div>
          </div>
          <h3 className="placeholder-title">{title} Settings</h3>
          <p className="placeholder-text">We're working on bringing you more customization options.</p>
        </div>
      </Card>
    </div>
  )
}

// Main Profile Page Component
export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "notifications":
        return <NotificationsSection />
      case "security":
        return <PlaceholderSection title="Security" />
      case "appearance":
        return <PlaceholderSection title="Appearance" />
      case "language":
        return <PlaceholderSection title="Language & Region" />
      case "help":
        return <PlaceholderSection title="Help & Support" />
      default:
        return <ProfileSection />
    }
  }

  return (
        <div className="profile-page">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
              <div className="sidebar-backdrop"></div>
            </div>
          )}

          {/* Sidebar */}
          <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-header-content">
                <div className="sidebar-logo">
                  <span>S</span>
                </div>
                <div className="sidebar-title-container">
                  <h1 className="sidebar-title">Settings</h1>
                  <p className="sidebar-subtitle">Stanford Portal</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="sidebar-close">
                <Icons.X className="icon-md" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
              <ul className="nav-list">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <li key={item.id} className="nav-item">
                      <button
                        onClick={() => {
                          setActiveSection(item.id)
                          setSidebarOpen(false)
                        }}
                        className={`nav-button ${isActive ? "nav-button-active" : ""}`}
                      >
                        <Icon className="nav-icon" />
                        {item.title}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Top Header */}
            <header className="main-header">
              <div className="header-container">
                <div className="header-left">
                  <button onClick={() => setSidebarOpen(true)} className="menu-button">
                    <Icons.Menu className="icon-md" />
                  </button>
                  <div className="header-title">
                    <h1>{navigationItems.find((item) => item.id === activeSection)?.title}</h1>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="page-content">
              <div className="content-container">{renderContent()}</div>
            </main>
          </div>
        </div>
  )
}
