<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ name: '', email: '', password: '', password_confirmation: '', role: 'etudiant' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.register(form.value)
    router.push('/dashboard')
  } catch (e) {
    const errs = e.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' ') : 'Erreur d\'inscription.'
  }
}
</script>

<template>
  <div class="card">
    <h2>Inscription</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <input v-model="form.name" placeholder="Nom complet" />
    <input v-model="form.email" type="email" placeholder="Courriel" />
    <input v-model="form.password" type="password" placeholder="Mot de passe (min. 8)" />
    <input v-model="form.password_confirmation" type="password" placeholder="Confirmer le mot de passe" />
    <select v-model="form.role">
      <option value="etudiant">Étudiant·e</option>
      <option value="formateur">Formateur·trice</option>
    </select>
    <button @click="submit">Créer mon compte</button>
  </div>
</template>
