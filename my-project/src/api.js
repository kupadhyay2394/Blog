// simple helper using fetch — keeps Authorization header in one place
export async function api(path, options = {}, token) {
  const base = options.baseUrl ?? ""; // set if you have API base different from same origin
  const headers = options.headers ?? {};
  headers["Content-Type"] = headers["Content-Type"] ?? "application/json";

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(base + path, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = body?.message ?? body ?? res.statusText;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}
