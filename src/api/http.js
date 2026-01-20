const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function http(
  path,
  {
    method = "GET",
    token,
    apiKey,
    body,
    headers: extraHeaders = {},
  } = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
