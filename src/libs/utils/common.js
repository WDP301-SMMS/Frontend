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
        { id: "view-records", label: "View Records", icon: "Eye" },
        { id: "schedule-vaccination", label: "Schedule Vaccination", icon: "Calendar" },
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
      icon: "Activity",
      active: false,
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: "BarChart3",
      active: false,
      subItems: [
        { id: "vaccination-reports", label: "Vaccination Reports", icon: "FileBarChart" },
        { id: "compliance-reports", label: "Compliance Reports", icon: "Shield" },
        { id: "health-analytics", label: "Health Analytics", icon: "Activity" },
      ],
    },
    {
      id: "user-management",
      label: "User Management",
      icon: "UserCheck",
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
    {
      id: 'home',
      label: 'Home',
      icon: 'Home',
    },
    {
      id: 'medical-event-management',
      label: 'Medical Event Management',
      icon: 'Bell', // Using Bell for medical events, can be changed
      subItems: [
        {
          id: 'record-incidents',
          label: 'Record Incidents',
          icon: 'FileBarChart', // Example icon
        },
        {
          id: 'view-medical-records',
          label: 'View Medical Records',
          icon: 'Eye', // Example icon
        },
      ],
    },
    {
      id: 'medication-supply-management',
      label: 'Medication and Supply Management',
      icon: 'Syringe', // Using Syringe for medication
      subItems: [
        {
          id: 'manage-medications',
          label: 'Manage Medications',
          icon: 'Syringe',
        },
        {
          id: 'manage-supplies',
          label: 'Manage Supplies',
          icon: 'Settings', // Example icon
        },
      ],
    },
    {
      id: 'vaccination-management',
      label: 'Vaccination Management',
      icon: 'Shield', // Using Shield for vaccination
      subItems: [
        {
          id: 'send-consent',
          label: 'Send Consent Form',
          icon: 'UserCheck', // Example icon
        },
        {
          id: 'prepare-list',
          label: 'Prepare List',
          icon: 'Users2', // Example icon
        },
        {
          id: 'vaccinate-record',
          label: 'Vaccinate & Record',
          icon: 'Syringe', // Example icon
        },
        {
          id: 'post-vaccination-monitoring',
          label: 'Post-Vaccination Monitoring',
          icon: 'Eye', // Example icon
        },
      ],
    },
    {
      id: 'periodic-medical-checkup',
      label: 'Periodic Medical Check-up',
      icon: 'Calendar', // Using Calendar for check-ups
      subItems: [
        {
          id: 'send-checkup-notice',
          label: 'Send Check-up Notice',
          icon: 'Bell', // Example icon
        },
        {
          id: 'prepare-checkup-list',
          label: 'Prepare Check-up List',
          icon: 'Users2', // Example icon
        },
        {
          id: 'perform-checkup',
          label: 'Perform Check-up',
          icon: 'Activity', // Example icon
        },
        {
          id: 'send-results-consult',
          label: 'Send Results & Consult',
          icon: 'BarChart3', // Example icon
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
    },
],
};