/** Single API Gateway base — all 6 backend services route through here */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_GATEWAY_API ||
  'http://localhost:8080';

export const API = {
  base: API_BASE,
};

export const DEV_USER = {
  studentId: import.meta.env.VITE_STUDENT_USER_ID || '201',
  mentorId: import.meta.env.VITE_MENTOR_USER_ID || '101',
};
