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
  const res = await fetch(url, { headers });
  return parseJson(res);
}

export async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function putJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function patchJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function deleteJson(url, headers = {}) {
  const res = await fetch(url, { method: 'DELETE', headers });
  return parseJson(res);
}
