/**
 * Payment Service API — wraps all 14 payment-service endpoints.
 * Base route: /api/payments (proxied through API gateway on port 8080)
 */
import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

// ─── CART ────────────────────────────────────────────────────────────────────

export async function fetchCart(user, token) {
  return getJson(`${base}/api/payments/cart`, authHeaders(user, token));
}

export async function addToCart(user, token, { courseId, trackId, itemType = 'course' }) {
  return postJson(
    `${base}/api/payments/cart/items`,
    { courseId, trackId, itemType },
    authHeaders(user, token)
  );
}

export async function updateCartItem(user, token, itemId, payload) {
  return putJson(
    `${base}/api/payments/cart/items/${itemId}`,
    payload,
    authHeaders(user, token)
  );
}

export async function removeFromCart(user, token, itemId) {
  return deleteJson(
    `${base}/api/payments/cart/items/${itemId}`,
    authHeaders(user, token)
  );
}

export async function clearCart(user, token) {
  return deleteJson(`${base}/api/payments/cart`, authHeaders(user, token));
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

export async function fetchWishlist(user, token) {
  return getJson(`${base}/api/payments/wishlist`, authHeaders(user, token));
}

export async function addToWishlist(user, token, { courseId, trackId }) {
  return postJson(
    `${base}/api/payments/wishlist/items`,
    { courseId, trackId },
    authHeaders(user, token)
  );
}

export async function removeFromWishlist(user, token, itemId) {
  return deleteJson(
    `${base}/api/payments/wishlist/items/${itemId}`,
    authHeaders(user, token)
  );
}

// ─── CHECKOUT + PAYMENT ───────────────────────────────────────────────────────

export async function fetchCheckoutSummary(user, token, { courseIds, trackId, couponCode } = {}) {
  return postJson(
    `${base}/api/payments/checkout`,
    { courseIds, trackId, couponCode },
    authHeaders(user, token)
  );
}

/**
 * Initiates a Razorpay order.
 * Returns { orderId, razorpayOrderId, razorpayKeyId, amount, currency, total, ... }
 */
export async function initiatePayment(user, token, { courseIds, trackId, couponCode, currency = 'INR' } = {}) {
  return postJson(
    `${base}/api/payments/initiate`,
    { courseIds, trackId, couponCode, currency },
    authHeaders(user, token)
  );
}

/**
 * Called after Razorpay payment completes on the frontend.
 * Sends payment_id, order_id, signature to backend for verification.
 * On success, backend emits payment.success Kafka event → enrollment-service enrolls student.
 */
export async function confirmPayment(user, token, { razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  return postJson(
    `${base}/api/payments/webhook`,
    { razorpay_payment_id, razorpay_order_id, razorpay_signature },
    authHeaders(user, token)
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export async function fetchMyOrders(user, token) {
  return getJson(`${base}/api/payments/orders/me`, authHeaders(user, token));
}

export async function fetchOrder(user, token, orderId) {
  return getJson(`${base}/api/payments/orders/${orderId}`, authHeaders(user, token));
}

export async function fetchInvoice(user, token, orderId) {
  return getJson(`${base}/api/payments/orders/${orderId}/invoice`, authHeaders(user, token));
}
