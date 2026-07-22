/** Default request timeout in milliseconds. */
const TIMEOUT_MS = 15_000;

/**
 * Wraps fetch with an AbortController timeout so that hung requests
 * (backend down, network unreachable, no CORS preflight reply) always
 * reject within TIMEOUT_MS instead of hanging forever.
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    // AbortError → friendly timeout message
    if (err.name === 'AbortError') {
      const timeout = new Error('Request timed out. Please check that the backend is running.');
      timeout.status = 0;
      throw timeout;
    }
    // "Failed to fetch" / net::ERR_CONNECTION_REFUSED → backend is down
    if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
      const network = new Error('Cannot reach the server. Please check your connection or start the backend.');
      network.status = 0;
      throw network;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function parseJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getJson(url, headers = {}) {
  const res = await fetchWithTimeout(url, { headers });
  return parseJson(res);
}

export async function postJson(url, body, headers = {}) {
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function putJson(url, body, headers = {}) {
  const res = await fetchWithTimeout(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function patchJson(url, body, headers = {}) {
  const res = await fetchWithTimeout(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function deleteJson(url, headers = {}) {
  const res = await fetchWithTimeout(url, { method: 'DELETE', headers });
  return parseJson(res);
}
