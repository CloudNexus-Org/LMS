import { API } from './config';
import { getJson, postJson } from './http';
import { authHeaders, mapAuthUser } from './apiHelpers';

const base = API.base;

export async function login(email, password, rememberMe = false) {
  const data = await postJson(`${base}/api/auth/login`, {
    email: email.trim().toLowerCase(),
    password,
    rememberMe,
  });
  return {
    user: mapAuthUser(data.user),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function register({ fullName, email, password }) {
  const data = await postJson(`${base}/api/auth/register`, {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
  });
  return {
    user: mapAuthUser(data.user),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function logout(token, refreshToken) {
  return postJson(
    `${base}/api/auth/logout`,
    refreshToken ? { refreshToken } : {},
    authHeaders(null, token)
  );
}

export async function forgotPassword(email) {
  return postJson(`${base}/api/auth/forgot-password`, { email });
}

export async function verifyOtp(email, code, purpose = 'PASSWORD_RESET') {
  return postJson(`${base}/api/auth/verify-otp`, { email, code, purpose });
}

export async function resendOtp(email, purpose = 'PASSWORD_RESET') {
  return postJson(`${base}/api/auth/resend-otp`, { email, purpose });
}

export async function resetPassword(email, code, newPassword) {
  return postJson(`${base}/api/auth/reset-password`, {
    email,
    code,
    newPassword,
    purpose: 'PASSWORD_RESET',
  });
}

export async function changePassword(token, currentPassword, newPassword) {
  return postJson(
    `${base}/api/auth/change-password`,
    { currentPassword, newPassword },
    authHeaders(null, token)
  );
}

export async function fetchMe(token) {
  const user = await getJson(`${base}/api/auth/me`, authHeaders(null, token));
  return mapAuthUser(user);
}
