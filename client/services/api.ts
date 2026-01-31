export const API_URL = "http://YOUR_IP:5000";

export async function apiFetch(path: string, options = {}) {
  return fetch(`${API_URL}${path}`, options);
}
