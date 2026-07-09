import axios from 'axios'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })

// --- Stockage du jeton Sanctum (voir SECURITE.md) ---
// Le jeton est conservé dans le localStorage et réinjecté ici dans l'en-tête
// Authorization de chaque requête. Limite connue : le localStorage est accessible
// par JavaScript, donc vulnérable en cas de faille XSS. Choix assumé pour ce projet
// (architecture découplée, contexte étudiant). Alternative plus sûre : cookies HttpOnly.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Gestion centralisée des erreurs API (intercepteur de réponse) ---
// Demandé par le professeur : rediriger l'utilisateur selon le code d'erreur.
//   401 = non authentifié (jeton expiré/invalide)  -> retour à la connexion
//   403 = authentifié mais non autorisé (mauvais rôle / formateur non approuvé)
//         -> retour au tableau de bord
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    } else if (status === 403) {
      if (window.location.pathname !== '/dashboard') {
        window.location.assign('/dashboard')
      }
    }

    return Promise.reject(error)
  }
)

export default api
