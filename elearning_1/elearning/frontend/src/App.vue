<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
async function logout() { await auth.logout(); router.push('/login') }
</script>

<template>
  <nav class="nav">
    <router-link to="/dashboard" class="brand">E-Learning</router-link>
    <div>
      <template v-if="auth.isLoggedIn">
        <router-link v-if="auth.isAdmin" to="/admin/approbations">Approbations</router-link>
        <router-link v-if="auth.isAdmin || (auth.isFormateur && auth.isApproved)" to="/cours">Mes cours</router-link>
        <router-link v-if="auth.isEtudiant" to="/catalogue">Catalogue</router-link>
        <span>{{ auth.user.name }} ({{ auth.user.role }})</span>
        <button @click="logout">Déconnexion</button>
      </template>
      <template v-else>
        <router-link to="/login">Connexion</router-link>
        <router-link to="/register">Inscription</router-link>
      </template>
    </div>
  </nav>
  <main><router-view /></main>
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 0; background: #f5f6fa; }
.nav { display: flex; justify-content: space-between; align-items: center;
  padding: 12px 24px; background: #1e293b; color: #fff; }
.nav a, .nav span { color: #fff; margin-left: 12px; }
.nav .brand { margin-left: 0; font-weight: bold; text-decoration: none; font-size: 16px; cursor: pointer; }
.nav button { margin-left: 12px; cursor: pointer; }
main { max-width: 560px; margin: 40px auto; padding: 0 16px; }
.card { background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
.card input, .card select { display: block; width: 100%; margin: 8px 0 16px; padding: 8px; box-sizing: border-box; }
.card button { padding: 10px 16px; cursor: pointer; }
.error { color: #dc2626; }
.muted { color: #64748b; font-size: 14px; }
.badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: #e2e8f0; margin-left: 8px; }
.badge.ok { background: #bbf7d0; }
.course-row, .module-row { max-width: 560px; margin: 16px auto 0; }
.course-row .actions { display: flex; gap: 8px; align-items: center; }
.course-row .actions button { padding: 6px 12px; }
.lesson-list { list-style: none; padding: 0; }
.lesson-list li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #eee; }
.lesson-list li button { margin-left: auto; padding: 4px 10px; font-size: 13px; }
button.danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 4px; }
</style>
