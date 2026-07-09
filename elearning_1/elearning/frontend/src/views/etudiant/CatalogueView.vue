<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'

// Catalogue des cours publiés + suivi des cours déjà commencés (semaine 3).
const cours = ref([])       // tous les cours publiés
const mesCours = ref([])    // cours suivis, avec progression (faites / total)
const error = ref('')

async function load() {
  error.value = ''
  try {
    const catalogue = await api.get('/etudiant/courses')
    cours.value = catalogue.data
    const suivis = await api.get('/etudiant/mes-cours')
    mesCours.value = suivis.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de chargement.'
  }
}

async function inscrire(c) {
  await api.post(`/etudiant/courses/${c.id}/inscription`)
  await load()
}

// Petit calcul de pourcentage pour la barre de progression.
function pourcentage(mc) {
  if (!mc.total) return 0
  return Math.round((mc.faites / mc.total) * 100)
}

onMounted(load)
</script>

<template>
  <div class="card">
    <h2>Catalogue des cours</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!cours.length" class="muted">Aucun cours publié pour le moment.</p>
  </div>

  <div class="card course-row" v-for="c in cours" :key="c.id">
    <h3>
      {{ c.titre }}
      <span v-if="c.est_inscrit" class="badge ok">Inscrit</span>
    </h3>
    <p>{{ c.description || 'Aucune description.' }}</p>
    <p class="muted">
      Formateur : {{ c.formateur?.name || '—' }} · {{ c.modules_count }} module(s)
    </p>
    <div class="actions">
      <router-link v-if="c.est_inscrit" :to="`/apprendre/${c.id}`">Continuer le cours →</router-link>
      <button v-else @click="inscrire(c)">S'inscrire</button>
    </div>
  </div>

  <div v-if="mesCours.length" class="card" style="margin-top: 24px;">
    <h2>Ma progression</h2>
    <div v-for="mc in mesCours" :key="mc.id" class="progress-item">
      <div class="progress-head">
        <router-link :to="`/apprendre/${mc.id}`">{{ mc.titre }}</router-link>
        <span class="muted">{{ mc.faites }} / {{ mc.total }} leçons</span>
      </div>
      <div class="bar"><div class="bar-fill" :style="{ width: pourcentage(mc) + '%' }"></div></div>
    </div>
  </div>
</template>

<style scoped>
.progress-item { margin: 16px 0; }
.progress-head { display: flex; justify-content: space-between; margin-bottom: 6px; }
.bar { background: #e2e8f0; border-radius: 999px; height: 10px; overflow: hidden; }
.bar-fill { background: #22c55e; height: 100%; transition: width .2s; }
</style>
