const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("BASE_URL:", BASE_URL);


export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Token ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    const message =
      err.detail ||
      err.seats ||
      err.event ||
      err.non_field_errors?.[0] ||
      Object.values(err)?.[0] ||
      `Error ${res.status}: ${res.statusText}`;

    throw new Error(message);
  }

  return res.json().catch(() => ({}));
}
