const BASE_URL = '/api';

export function getToken() {
  return localStorage.getItem('takhub_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('takhub_token', token);
  else localStorage.removeItem('takhub_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me', { auth: true }),

  createGame: (payload) => request('/games', { method: 'POST', body: payload, auth: true }),
  listPublicGames: () => request('/games/public'),
  listMyGames: () => request('/games/mine', { auth: true }),
  joinByCode: (joinCode) => request('/games/join-by-code', { method: 'POST', body: { joinCode }, auth: true }),
  getGame: (id) => request(`/games/${id}`),
  joinGame: (id) => request(`/games/${id}/join`, { method: 'POST', auth: true }),
  playMove: (id, move) => request(`/games/${id}/move`, { method: 'POST', body: { move }, auth: true }),

  // Chat de partie (Sprint 3)
  listMessages: (gameId) => request(`/games/${gameId}/messages`),
  postMessage: (gameId, text) => request(`/games/${gameId}/messages`, { method: 'POST', body: { text }, auth: true }),

  // Blogs (Sprint 3)
  listPosts: () => request('/blogs'),
  createPost: (payload) => request('/blogs', { method: 'POST', body: payload, auth: true }),
  getPost: (id) => request(`/blogs/${id}`),
  addComment: (id, text) => request(`/blogs/${id}/comments`, { method: 'POST', body: { text }, auth: true }),

  // Groupes (Sprint 3)
  listGroups: () => request('/groups'),
  createGroup: (payload) => request('/groups', { method: 'POST', body: payload, auth: true }),
  getGroup: (id) => request(`/groups/${id}`),
  joinGroup: (id) => request(`/groups/${id}/join`, { method: 'POST', auth: true }),
  leaveGroup: (id) => request(`/groups/${id}/leave`, { method: 'POST', auth: true }),

  // Puzzles (Sprint 3)
  listPuzzles: () => request('/puzzles'),
  getPuzzle: (id) => request(`/puzzles/${id}`),
  attemptPuzzle: (id, move) => request(`/puzzles/${id}/attempt`, { method: 'POST', body: { move } }),
};
