<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api'

// Consultation du contenu d'un cours suivi + suivi de progression (semaine 3).
const route = useRoute()
const courseId = route.params.id

const course = ref(null)
const faites = ref([])      // identifiants des leçons déjà complétées
const error = ref('')

// Origine du backend (ex: http://127.0.0.1:8000), pour afficher les fichiers téléversés.
const API_ORIGIN = api.defaults.baseURL.replace(/\/api$/, '')

// Construit l'URL complète d'un média.
// - Lien externe (http...) : on l'utilise tel quel (ex: PDF en ligne).
// - Fichier téléversé (/storage/...) : on ajoute l'adresse du backend.
function mediaUrl(u) {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return API_ORIGIN + u
}

// Transforme un lien YouTube en lien "embed" (pour l'afficher dans un iframe).
// Renvoie null si ce n'est pas une vidéo YouTube (donc un fichier vidéo classique).
function youtubeEmbed(u) {
  const m = u && u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

async function load() {
  error.value = ''
  try {
    const { data } = await api.get(`/etudiant/courses/${courseId}`)
    course.value = data.course
    faites.value = data.lecons_faites
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de chargement.'
  }
}

// Une leçon est-elle marquée complétée ?
function estFaite(lesson) {
  return faites.value.includes(lesson.id)
}

// Cocher / décocher une leçon : on envoie l'état voulu au serveur.
async function basculer(lesson) {
  const complete = !estFaite(lesson)
  await api.post(`/etudiant/lessons/${lesson.id}/progression`, { complete })
  if (complete) faites.value.push(lesson.id)
  else faites.value = faites.value.filter((id) => id !== lesson.id)
}

// Nombre total de leçons du cours (pour la progression globale).
const total = computed(() => {
  if (!course.value) return 0
  return course.value.modules.reduce((n, m) => n + m.lessons.length, 0)
})

onMounted(load)
</script>

<template>
  <div v-if="error" class="card"><p class="error">{{ error }}</p>
    <router-link to="/catalogue">&larr; Retour au catalogue</router-link>
  </div>

  <template v-if="course">
    <div class="card">
      <router-link to="/catalogue">&larr; Catalogue</router-link>
      <h2>{{ course.titre }}</h2>
      <p>{{ course.description || 'Aucune description.' }}</p>
      <p class="muted">Progression : {{ faites.length }} / {{ total }} leçons complétées</p>
    </div>

    <div v-for="m in course.modules" :key="m.id" class="card module-row">
      <h3>{{ m.titre }}</h3>
      <p v-if="!m.lessons.length" class="muted">Aucune leçon dans ce module.</p>

      <div v-for="l in m.lessons" :key="l.id" class="lecon">
        <label class="lecon-titre">
          <input type="checkbox" :checked="estFaite(l)" @change="basculer(l)" />
          <strong>{{ l.titre }}</strong>
          <span class="badge">{{ l.type }}</span>
        </label>

        <!-- Contenu selon le type de leçon -->
        <p v-if="l.contenu" class="lecon-contenu">{{ l.contenu }}</p>

        <!-- Vidéo : lecteur YouTube intégré, ou lecteur vidéo pour un fichier téléversé -->
        <template v-if="l.type === 'video' && l.url_media">
          <iframe v-if="youtubeEmbed(l.url_media)" class="media-video"
            :src="youtubeEmbed(l.url_media)" allowfullscreen></iframe>
          <video v-else class="media-video" :src="mediaUrl(l.url_media)" controls></video>
        </template>

        <!-- PDF : aperçu intégré dans la page + lien pour l'ouvrir en grand -->
        <template v-if="l.type === 'pdf' && l.url_media">
          <iframe class="media-pdf" :src="mediaUrl(l.url_media)"></iframe>
          <p><a :href="mediaUrl(l.url_media)" target="_blank" rel="noopener">📄 Ouvrir le PDF dans un onglet</a></p>
        </template>
      </div>
    </div>
  </template>
</template>

<style scoped>
.lecon { padding: 10px 0; border-bottom: 1px solid #eee; }
.lecon:last-child { border-bottom: none; }
.lecon-titre { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.lecon-titre input { width: auto; margin: 0; }
.lecon-contenu { margin: 6px 0 0 26px; color: #334155; }
.media-video { width: 100%; aspect-ratio: 16 / 9; border: 0; margin-top: 8px; display: block; background: #000; }
.media-pdf { width: 100%; height: 480px; border: 1px solid #ddd; margin-top: 8px; }
</style>
