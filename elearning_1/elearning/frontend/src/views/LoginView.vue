<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref(''), password = ref(''), error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de connexion.'
  }
}
</script>

<template>
  <div class="card">
    <h2>Connexion</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <input v-model="email" type="email" placeholder="Courriel" />
    <input v-model="password" type="password" placeholder="Mot de passe" @keyup.enter="submit" />
    <button @click="submit">Se connecter</button>
  </div>
</template>
