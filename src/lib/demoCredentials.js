import { ROLE_DASHBOARDS } from "@/protectedroutes/routePaths";

/** Demo accounts for local development (mock auth — no backend) */
export const DEMO_ACCOUNTS = [
  {
    email: "student@cloudnexus.com",
    password: "password123",
    role: "student",
    fullName: "Student User",
  },
  {
    email: "mentor@cloudnexus.com",
    password: "password123",
    role: "mentor",
    fullName: "Mentor User",
  },
  {
    email: "admin@cloudnexus.com",
    password: "password123",
    role: "admin",
    fullName: "Admin User",
  },
];

export function authenticateDemoUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (entry) => entry.email === normalizedEmail
  );

  if (!account || account.password !== password) {
    return null;
  }

  return {
    username: account.email,
    email: account.email,
    fullName: account.fullName,
    role: account.role,
  };
}

export function getDefaultDashboardForRole(role) {
  return ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.student;
}
