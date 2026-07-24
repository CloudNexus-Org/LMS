/** Central route path constants */
export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",

  courses: "/courses",
  cart: "/cart",
  mentors: "/mentors",

  student: {
    root: "/student",
    dashboard: "/student/dashboard",
    courses: "/student/courses",
    catalog: "/student/catalog",
    cart: "/student/cart",
    payment: "/student/payment",
    certificates: "/student/certificates",
    assignments: "/student/assignments",
    reviews: "/student/reviews",
    quizzes: "/student/quizzes",
    profile: "/student/profile",
    settings: "/student/settings",
    notifications: "/student/notifications",
    wishlist: "/student/wishlist",
    notes: "/student/notes",
    learn: "/student/learn",
  },

  mentor: {
    root: "/mentor",
    dashboard: "/mentor/dashboard",
    upload: "/mentor/upload",
    lessons: "/mentor/lessons",
    analytics: "/mentor/analytics",
    students: "/mentor/students",
    notifications: "/mentor/notifications",
    profile: "/mentor/profile",
  },

  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    addMentor: "/admin/users/add-mentor",
    approvals: "/admin/approvals",
    revenue: "/admin/revenue",
    reports: "/admin/reports",
    settings: "/admin/settings",
    notifications: "/admin/notifications",
    profile: "/admin/profile",
  },
};

export const ROLE_DASHBOARDS = {
  student: ROUTES.student.dashboard,
  mentor: ROUTES.mentor.dashboard,
  admin: ROUTES.admin.dashboard,
};
