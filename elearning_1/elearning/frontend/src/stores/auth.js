import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === 'admin',
    isFormateur: (s) => s.user?.role === 'formateur' || s.user?.role === 'admin',
    isEtudiant: (s) => s.user?.role === 'etudiant',
    // Un formateur non approuvé est connecté mais "en attente".
    isApproved: (s) => !!s.user?.is_approved,
    isFormateurEnAttente: (s) => s.user?.role === 'formateur' && !s.user?.is_approved,
  },
  actions: {
    persist(user, token) {
      this.user = user; this.token = token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    },
    async register(payload) {
      const { data } = await api.post('/register', payload)
      this.persist(data.user, data.token)
    },
    async login(payload) {
      const { data } = await api.post('/login', payload)
      this.persist(data.user, data.token)
    },
    async logout() {
      try { await api.post('/logout') } catch {}
      this.user = null; this.token = null
      localStorage.removeItem('user'); localStorage.removeItem('token')
    },
  },
})
