<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="card">
    <h2>Tableau de bord</h2>
    <p>Bienvenue, <strong>{{ auth.user.name }}</strong>.</p>
    <p>Rôle : <strong>{{ auth.user.role }}</strong></p>

    <!-- Formateur en attente d'approbation -->
    <div v-if="auth.isFormateurEnAttente" class="alerte">
      <strong>Compte en attente d'approbation.</strong>
      Votre inscription comme formateur a bien été enregistrée. Un administrateur doit
      activer votre compte avant que vous puissiez créer des cours.
    </div>

    <!-- Admin -->
    <template v-else-if="auth.isAdmin">
      <p><router-link to="/admin/approbations">Gérer les approbations de formateurs →</router-link></p>
      <p><router-link to="/cours">Gérer les cours →</router-link></p>
    </template>

    <!-- Formateur approuvé -->
    <p v-else-if="auth.isFormateur">
      <router-link to="/cours">Gérer mes cours →</router-link>
    </p>

    <!-- Étudiant -->
    <p v-else>
      <router-link to="/catalogue">Parcourir le catalogue des cours →</router-link>
    </p>
  </div>
</template>

<style scoped>
.alerte {
  margin-top: 12px; padding: 12px 16px; border-radius: 6px;
  background: #fef3c7; border: 1px solid #fde68a; color: #92400e;
}
</style>
