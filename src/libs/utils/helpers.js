export const utils = {
  getStatusColor: (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-50 text-red-700 border border-red-200";
      case "due-soon":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "upcoming":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  },
  getDaysUntilDueColor: (daysUntilDue) => {
    if (daysUntilDue < 0) return "bg-red-100 text-red-800";
    if (daysUntilDue <= 30) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  },
  getRoleIcon: (role) => {
    switch (role) {
      case "parent":
        return "👤";
      case "nurse":
        return "🩺";
      case "student":
        return "🎓";
      default:
        return "👤";
    }
  },
};
