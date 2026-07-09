<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'

const courses = ref([])
const titre = ref('')
const description = ref('')
const error = ref('')

async function load() {
  const { data } = await api.get('/formateur/courses')
  courses.value = data
}

async function create() {
  error.value = ''
  if (!titre.value.trim()) return
  try {
    await api.post('/formateur/courses', { titre: titre.value, description: description.value })
    titre.value = ''
    description.value = ''
    await load()
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de création.'
  }
}

async function togglePublie(course) {
  await api.put(`/formateur/courses/${course.id}`, { publie: !course.publie })
  await load()
}

async function remove(course) {
  if (!confirm(`Supprimer "${course.titre}" et tout son contenu (modules, leçons) ?`)) return
  await api.delete(`/formateur/courses/${course.id}`)
  await load()
}

onMounted(load)
</script>

<template>
  <div class="card">
    <h2>Mes cours</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <input v-model="titre" placeholder="Titre du cours" @keyup.enter="create" />
    <input v-model="description" placeholder="Description (optionnel)" />
    <button @click="create">Créer le cours</button>
  </div>

  <div class="card course-row" v-for="c in courses" :key="c.id">
    <h3>
      {{ c.titre }}
      <span :class="['badge', c.publie ? 'ok' : '']">{{ c.publie ? 'Publié' : 'Brouillon' }}</span>
    </h3>
    <p>{{ c.description || 'Aucune description.' }}</p>
    <p class="muted">{{ c.modules?.length || 0 }} module(s)</p>
    <div class="actions">
      <router-link :to="`/cours/${c.id}`">Gérer le contenu</router-link>
      <button @click="togglePublie(c)">{{ c.publie ? 'Dépublier' : 'Publier' }}</button>
      <button @click="remove(c)">Supprimer</button>
    </div>
  </div>

  <p v-if="!courses.length" class="muted">Aucun cours pour l'instant. Crée ton premier cours ci-dessus.</p>
</template>
