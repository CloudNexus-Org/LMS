import { API } from './config';
import { deleteJson, getJson, patchJson, postJson, putJson } from './http';
import {
  authHeaders,
  mapAdminUser,
  toBackendRole,
  toBackendStatus,
} from './apiHelpers';

const base = API.base;

export async function fetchProfile(user, token) {
  return getJson(`${base}/api/users/profile`, authHeaders(user, token));
}

export async function updateProfile(user, token, payload) {
  return putJson(`${base}/api/users/profile`, payload, authHeaders(user, token));
}

export async function updateAvatar(user, token, avatarUrl) {
  return patchJson(
    `${base}/api/users/profile/avatar`,
    { avatarUrl },
    authHeaders(user, token)
  );
}

export async function changePasswordViaProfile(user, token, payload) {
  return putJson(`${base}/api/users/profile/settings`, payload, authHeaders(user, token));
}

export async function fetchUsers(user, token, params = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.roleFilter && params.roleFilter !== 'All') {
    qs.set('roleFilter', toBackendRole(params.roleFilter));
  }
  if (params.status && params.status !== 'All') {
    qs.set('status', toBackendStatus(params.status));
  }
  qs.set('page', params.page ?? 0);
  qs.set('size', params.size ?? 100);
  const data = await getJson(`${base}/api/users?${qs}`, authHeaders(user, token));
  return {
    ...data,
    content: (data.content || []).map(mapAdminUser),
  };
}

export async function createMentor(user, token, payload) {
  const created = await postJson(
    `${base}/api/users/mentors`,
    payload,
    authHeaders(user, token)
  );
  return mapAdminUser(created) || created;
}

export async function updateUser(user, token, userId, payload) {
  const updated = await putJson(
    `${base}/api/users/${userId}`,
    {
      fullName: payload.fullName ?? payload.name,
      email: payload.email,
      role: payload.role ? toBackendRole(payload.role) : undefined,
      status: payload.status ? toBackendStatus(payload.status) : undefined,
      phone: payload.phone,
      bio: payload.bio,
      professionalRole: payload.professionalRole,
      company: payload.company,
      trackLabel: payload.trackLabel,
      location: payload.location,
    },
    authHeaders(user, token)
  );
  return mapAdminUser(updated);
}

export async function updateUserStatus(user, token, userId, status) {
  const updated = await patchJson(
    `${base}/api/users/${userId}/status`,
    { status: toBackendStatus(status) },
    authHeaders(user, token)
  );
  return mapAdminUser(updated);
}

export async function deleteUser(user, token, userId) {
  return deleteJson(`${base}/api/users/${userId}`, authHeaders(user, token));
}
