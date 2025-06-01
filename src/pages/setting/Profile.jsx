"use client"

import { useState } from "react"

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

// Custom Toggle Switch Component using Tailwind's peer modifier
function ToggleSwitch({ checked = false, onChange, disabled = false, id }) {
  return (
    <div className="group/toggle">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={`
          relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus-within:outline-none focus-within:ring-2 
          focus-within:ring-[#8C1515] focus-within:ring-offset-2
          ${checked ? "bg-[#8C1515]" : "bg-gray-200"}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span className="sr-only">{checked ? "Enabled" : "Disabled"}</span>
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </label>
    </div>
  )
}

// Custom Select Component using Tailwind
function CustomSelect({ value, onChange, options, placeholder, id, label }) {
  return (
    <div className="group/select space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="
            w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm 
            focus:border-[#8C1515] focus:outline-none focus:ring-1 focus:ring-[#8C1515]
            group-hover/select:border-gray-400
          "
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icons.ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within/select:text-[#8C1515]" />
      </div>
    </div>
  )
}

// Custom Input Component using Tailwind
function CustomInput({ type = "text", id, value, onChange, placeholder, label }) {
  return (
    <div className="group/input space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
          focus:border-[#8C1515] focus:outline-none focus:ring-1 focus:ring-[#8C1515]
          group-hover/input:border-gray-400
        "
      />
    </div>
  )
}

// Custom Textarea Component using Tailwind
function CustomTextarea({ id, value, onChange, placeholder, label, rows = 3 }) {
  return (
    <div className="group/textarea space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm 
          focus:border-[#8C1515] focus:outline-none focus:ring-1 focus:ring-[#8C1515]
          group-hover/textarea:border-gray-400
        "
      />
    </div>
  )
}

// Card Component using Tailwind
function Card({ title, description, children, className = "" }) {
  return (
    <div
      className={`group/card mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}
      <div className="px-6 py-6">{children}</div>
    </div>
  )
}

// Toggle Item Component using Tailwind
function ToggleItem({ title, description, checked, onChange, id }) {
  return (
    <div className="group/toggle-item flex items-center justify-between py-2">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} />
    </div>
  )
}

// Button Component using Tailwind
function Button({ children, variant = "primary", onClick, className = "" }) {
  const baseClasses =
    "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:ring-offset-2"
  const variantClasses = {
    primary: "bg-[#8C1515] text-white border border-transparent hover:bg-[#7A1010]",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
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
    <div className="group/profile-section">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#8C1515]">Profile Settings</h2>
        <p className="mt-2 text-gray-600">Manage your personal information and preferences.</p>
      </div>

      <Card title="Personal Information" description="Update your basic profile details">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        <div className="space-y-6">
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

      <div className="flex justify-end space-x-3">
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
    <div className="group/notifications-section">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#8C1515]">Notification Settings</h2>
        <p className="mt-2 text-gray-600">Choose how you want to be notified about updates and activities.</p>
      </div>

      <Card title="Email Notifications" description="Manage your email notification preferences">
        <div className="space-y-6">
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
        <div className="space-y-6">
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

      <div className="flex justify-end space-x-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  )
}

// Placeholder Section Component
function PlaceholderSection({ title }) {
  return (
    <div className="group/placeholder-section">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#8C1515]">{title}</h2>
        <p className="mt-2 text-gray-600">This section is coming soon.</p>
      </div>

      <Card>
        <div className="flex h-64 items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <div className="h-8 w-8 rounded-full bg-gray-400"></div>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">{title} Settings</h3>
            <p className="text-gray-600">We're working on bringing you more customization options.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Main Settings Page Component
export default function SettingsPage() {
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
    <div className="group/settings-page min-h-screen bg-gray-50 font-sans antialiased">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="group/overlay fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          group/sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="group/sidebar-header flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-[#8C1515] px-4">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-[#8C1515]">S</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-white">Settings</h1>
              <p className="truncate text-xs text-red-100">Stanford Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 flex-shrink-0 text-white hover:text-red-100 lg:hidden"
          >
            <Icons.X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="group/sidebar-nav flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <li key={item.id} className="group/nav-item">
                  <button
                    onClick={() => {
                      setActiveSection(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`
                      group/nav-button flex w-full items-center rounded-md px-3 py-3 text-sm font-medium 
                      transition-colors duration-150
                      ${isActive ? "bg-[#8C1515] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="group/main-content flex min-h-screen flex-col lg:pl-64">
        {/* Top Header */}
        <header className="group/header flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
                <Icons.Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigationItems.find((item) => item.id === activeSection)?.title}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="group/page-content flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}