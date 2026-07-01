import { API } from './config';
import { deleteJson, getJson, patchJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export const NOTIFICATIONS_CHANGED = 'lms:notifications-changed';

export function emitNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}

function formatRelative(iso) {
  if (!iso) return 'Recently';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
}

export function mapNotification(n) {
  if (!n) return null;
  const unread = n.unread ?? !n.read;
  const content = n.content ?? n.message ?? '';
  const action = n.action ?? (n.link
    ? { label: n.actionLabel || 'View', to: n.link }
    : null);
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    content,
    time: n.time || formatRelative(n.createdAt),
    unread,
    priority: n.priority,
    action,
  };
}

export async function fetchMyNotifications(user, token, page = 0, size = 50) {
  const data = await getJson(
    `${base}/api/notifications/me?page=${page}&size=${size}`,
    authHeaders(user, token)
  );
  const list = data.content ?? data;
  return (Array.isArray(list) ? list : []).map(mapNotification);
}

export async function fetchUnreadCount(user, token) {
  const data = await getJson(`${base}/api/notifications/unread-count`, authHeaders(user, token));
  return data?.count ?? 0;
}

export async function markNotificationRead(user, token, notificationId) {
  const data = await patchJson(
    `${base}/api/notifications/${notificationId}/read`,
    {},
    authHeaders(user, token)
  );
  return mapNotification(data);
}

export async function markAllNotificationsRead(user, token) {
  return patchJson(`${base}/api/notifications/read-all`, {}, authHeaders(user, token));
}

export async function deleteNotification(user, token, notificationId) {
  return deleteJson(`${base}/api/notifications/${notificationId}`, authHeaders(user, token));
}

export async function fetchNotificationPreferences(user, token) {
  return getJson(`${base}/api/notifications/preferences`, authHeaders(user, token));
}

export async function updateNotificationPreferences(user, token, payload) {
  return putJson(`${base}/api/notifications/preferences`, payload, authHeaders(user, token));
}

export async function sendBroadcastNotification(user, token, payload) {
  const list = await postJson(`${base}/api/notifications/send`, payload, authHeaders(user, token));
  return (list || []).map(mapNotification);
}
