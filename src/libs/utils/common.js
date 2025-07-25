export const mockData = {
  boosterNotifications: [
    {
      id: 1,
      studentName: "Nguyễn Minh An",
      studentId: "ST001",
      lastVaccine: "COVID-19 Dose 2",
      lastDate: "2024-01-15",
      boosterDue: "2024-07-15",
      daysUntilDue: 44,
      status: "due-soon",
      parentEmail: "parent.an@email.com",
      notificationSent: false,
    },
    {
      id: 2,
      studentName: "Trần Thị Bình",
      studentId: "ST002",
      lastVaccine: "Hepatitis B",
      lastDate: "2023-12-10",
      boosterDue: "2024-06-10",
      daysUntilDue: -22,
      status: "overdue",
      parentEmail: "parent.binh@email.com",
      notificationSent: true,
    },
    {
      id: 3,
      studentName: "Lê Văn Cường",
      studentId: "ST003",
      lastVaccine: "Tetanus",
      lastDate: "2024-02-20",
      boosterDue: "2024-08-20",
      daysUntilDue: 80,
      status: "upcoming",
      parentEmail: "parent.cuong@email.com",
      notificationSent: false,
    },
  ],
  vaccinationRecords: [
    {
      id: 1,
      studentName: "Nguyễn Minh An",
      studentId: "ST001",
      class: "10A1",
      vaccines: [
        {
          name: "COVID-19 Dose 1",
          date: "2023-07-15",
          location: "School Clinic",
          status: "completed",
        },
        {
          name: "COVID-19 Dose 2",
          date: "2024-01-15",
          location: "School Clinic",
          status: "completed",
        },
        {
          name: "Hepatitis B",
          date: "2023-05-10",
          location: "District Hospital",
          status: "completed",
        },
      ],
      upcomingVaccines: [
        {
          name: "COVID-19 Booster",
          scheduledDate: "2024-07-15",
          location: "School Clinic",
        },
      ],
    },
    {
      id: 2,
      studentName: "Trần Thị Bình",
      studentId: "ST002",
      class: "11B2",
      vaccines: [
        {
          name: "Tetanus",
          date: "2023-09-05",
          location: "School Clinic",
          status: "completed",
        },
        {
          name: "Hepatitis B",
          date: "2023-12-10",
          location: "Local Clinic",
          status: "completed",
        },
      ],
      upcomingVaccines: [
        {
          name: "Hepatitis B Booster",
          scheduledDate: "2024-06-10",
          location: "School Clinic",
        },
      ],
    },
  ],
  menuItems: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "Home",
      active: false,
    },
    {
      id: "vaccination-management",
      label: "Vaccination Management",
      icon: "Syringe",
      active: true,
      subItems: [
        { id: "auto-check", label: "Auto Check Booster", icon: "Bell" },
        { id: "view-records", label: "View Records", icon: "FileText" },
        {
          id: "schedule-vaccination",
          label: "Schedule Vaccination",
          icon: "Calendar",
        },
      ],
    },
    {
      id: "student-management",
      label: "Student Management",
      icon: "Users2",
      active: false,
    },
    {
      id: "health-records",
      label: "Health Records",
      icon: "Heart",
      active: false,
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: "BarChart3",
      active: false,
      subItems: [
        {
          id: "vaccination-reports",
          label: "Vaccination Reports",
          icon: "FileBarChart",
        },
        {
          id: "compliance-reports",
          label: "Compliance Reports",
          icon: "Shield",
        },
        { id: "health-analytics", label: "Health Analytics", icon: "TrendingUp" },
      ],
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "Users",
      active: false,
    },
    {
      id: "school-settings",
      label: "School Settings",
      icon: "Building2",
      active: false,
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: "Settings",
      active: false,
    },
  ],
  menuItemsNurse: [
    // {
    //   id: 'home',
    //   label: 'Trang chủ',
    //   icon: 'Home',
    //   route: '/management/nurse',
    // },
    {
      id: "medical-event-management",
      label: "Quản lý sự kiện y tế",
      icon: "AlertTriangle",
      subItems: [
        {
          id: "record-incidents",
          label: "Ghi nhận sự cố",
          icon: "FileText",
          route: "/management/nurse/record-incidents",
        },
        {
          id: "view-medical-records",
          label: "Lịch sử sự cố",
          icon: "History",
          route: "/management/nurse/view-medical-records",
        },
      ],
    },
    {
      id: "medication-requests-manager",
      label: "Gửi thuốc cho học sinh",
      icon: "Pill",
      subItems: [
        {
          id: "medication-requests",
          label: "Yêu cầu thuốc",
          icon: "FileText",
          route: "/management/nurse/medication-requests",
        },
        {
          id: "medication-schedules",
          label: "Lịch uống thuốc",
          icon: "Clock",
          route: "/management/nurse/medication-schedules",
        },
      ],
    },
    {
      id: "medication-supply-management",
      label: "Cấp phát thuốc & vật tư",
      icon: "Package",
      subItems: [
        {
          id: "manage-medications",
          label: "Cấp phát",
          icon: "Package",
          route: "/management/nurse/manage-medications",
        },
        {
          id: "manage-supplies",
          label: "Lịch sử cấp phát",
          icon: "History",
          route: "/management/nurse/manage-supplies",
        },
      ],
    },
    {
      id: "vaccination-management",
      label: "Quản lý tiêm chủng",
      icon: "Syringe",
      subItems: [
        {
          id: "send-consent",
          label: "Gửi phiếu đồng thuận",
          icon: "FileCheck",
          route: "/management/nurse/send-vaccination-consent",
        },
        {
          id: "prepare-list",
          label: "Chuẩn bị danh sách",
          icon: "List",
          route: "/management/nurse/prepare-vaccination-list",
        },
        {
          id: "vaccinate-record",
          label: "Tiêm chủng & Ghi nhận",
          icon: "Syringe",
          route: "/management/nurse/vaccinate-record",
        },
        {
          id: "post-vaccination-monitoring",
          label: "Theo dõi sau tiêm",
          icon: "Eye",
          route: "/management/nurse/post-vaccination-monitoring",
        },
      ],
    },
    {
      id: "periodic-medical-checkup",
      label: "Kiểm tra y tế định kỳ",
      icon: "Activity",
      subItems: [
        {
          id: "send-checkup-notice",
          label: "Gửi thông báo khám sức khỏe",
          icon: "Bell",
          route: "/management/nurse/send-checkup-notice",
        },
        {
          id: "prepare-checkup-list",
          label: "Chuẩn bị danh sách khám",
          icon: "List",
          route: "/management/nurse/prepare-checkup-list",
        },
        {
          id: "perform-checkup",
          label: "Thực hiện khám & Ghi nhận",
          icon: "Heart",
          route: "/management/nurse/perform-checkup",
        },
        {
          id: "send-results-consult",
          label: "Theo dõi sau khám",
          icon: "Eye",
          route: "/management/nurse/send-results-consult",
        },
      ],
    },
    // {
    //   id: 'settings',
    //   label: 'Cài đặt',
    //   icon: 'Settings',
    //   route: '/management/nurse/settings',
    // },
  ],

  menuItemsManager: [
    // {
    //   id: 'home',
    //   label: 'Trang chủ',
    //   icon: 'Home',
    //   route: '/management/manager',
    // },
    // {
    //   id: 'nurse-management',
    //   label: 'Quản lý y tá',
    //   icon: 'Bell',
    //   subItems: [
    //     {
    //       id: 'manage-nurse-records',
    //       label: 'Quản lý hồ sơ y tá',
    //       icon: 'FileBarChart',
    //       route: '/management/manager/nurse-management',
    //     },
    //   ],
    // },
    {
      id: "medication-supply-management",
      label: "Quản lý thuốc & vật tư",
      icon: "Package",
      subItems: [
        {
          id: "manage-medications",
          label: "Quản lý thuốc",
          icon: "Pill",
          route: "/management/manager/manage-medications",
        },
        {
          id: "manage-supplies",
          label: "Quản lý vật tư",
          icon: "Package2",
          route: "/management/manager/manage-supplies",
        },
      ],
    },
    {
      id: "vaccination-campaign-management",
      label: "Quản lý chiến dịch tiêm chủng",
      icon: "Shield",
      subItems: [
        {
          id: "manage-vaccination-campaigns",
          label: "Quản lý chiến dịch",
          icon: "Target",
          route: "/management/manager/campaigns-management",
        },
      ],
    },
    {
      id: "periodic-checkup-management",
      label: "Quản lý khám định kỳ",
      icon: "Calendar",
      subItems: [
        {
          id: "manage-consent-forms",
          label: "Quản lý Mẫu khám",
          icon: "FileText",
          route: "/management/manager/medical-check-up-management",
        },
        {
          id: "manage-health-check-campaigns",
          label: "Quản lý chiến dịch kiểm tra sức khỏe",
          icon: "Heart",
          route: "/management/manager/manage-health-check-campaigns",
        },
      ],
    },
    // {
    //   id: 'partner-management',
    //   label: 'Quản lý đối tác',
    //   icon: 'Shield',
    //   subItems: [
    //     {
    //       id: 'manage-partner',
    //       label: 'Quản lý đối tác',
    //       icon: 'UserCheck',
    //       route: '/management/manager/manage-partner',
    //     },
    //   ],
    // },
    {
      id: "manage-blogs",
      label: "Quản lí blog",
      icon: "BookOpen",
      route: "/management/manager/manage-blogs",
    },
    // {
    //   id: 'settings',
    //   label: 'Cài đặt',
    //   icon: 'Settings',
    //   route: '/management/manager/settings',
    // },
  ],
  menuItemsAdmin: [
    {
      id: "admin-dashboard",
      label: "Báo cáo",
      icon: "BarChart3",
      route: "/management/admin",
    },
    {
      id: "nurse-management",
      label: "Quản lý y tá",
      icon: "User",
      route: "/management/admin/users",
    },
    {
      id: "student-management",
      label: "Quản lý học sinh",
      icon: "Users2",
      route: "/management/admin/students",
    },
    {
      id: "class-management",
      label: "Quản lý lớp học",
      icon: "Book",
      route: "/management/admin/classes",
    },
    {
      id: "partner-management",
      label: "Quản lý đối tác",
      icon: "Building2",
      route: "/management/admin/partners",
    },
  ],
};