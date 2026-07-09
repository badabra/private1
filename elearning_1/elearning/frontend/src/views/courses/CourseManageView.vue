<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../api'

const route = useRoute()
const courseId = route.params.id

const course = ref(null)
const newModuleTitre = ref('')
const newLesson = ref({}) // { [moduleId]: { titre, type, contenu, url_media, fichier } }
const uploadKey = ref(0)  // sert à réinitialiser les champs "fichier" après un ajout

function emptyDraft() {
  return { titre: '', type: 'texte', contenu: '', url_media: '', fichier: null }
}

async function load() {
  const { data } = await api.get(`/formateur/courses/${courseId}`)
  course.value = data
  for (const m of data.modules) {
    if (!newLesson.value[m.id]) newLesson.value[m.id] = emptyDraft()
  }
}

async function addModule() {
  if (!newModuleTitre.value.trim()) return
  await api.post(`/formateur/courses/${courseId}/modules`, { titre: newModuleTitre.value })
  newModuleTitre.value = ''
  await load()
}

async function removeModule(module) {
  if (!confirm(`Supprimer le module "${module.titre}" et ses leçons ?`)) return
  await api.delete(`/formateur/modules/${module.id}`)
  await load()
}

// L'utilisateur choisit un fichier : on le garde dans le brouillon du module.
function onFile(e, moduleId) {
  newLesson.value[moduleId].fichier = e.target.files[0] || null
}

async function addLesson(module) {
  const draft = newLesson.value[module.id]
  if (!draft?.titre?.trim()) return
  // On utilise FormData car on peut envoyer un fichier (multipart), pas seulement du texte.
  const form = new FormData()
  form.append('titre', draft.titre)
  form.append('type', draft.type)
  if (draft.contenu) form.append('contenu', draft.contenu)
  if (draft.url_media) form.append('url_media', draft.url_media)
  if (draft.fichier) form.append('fichier', draft.fichier)
  await api.post(`/formateur/modules/${module.id}/lessons`, form)
  newLesson.value[module.id] = emptyDraft()
  uploadKey.value++ // vide le champ fichier affiché
  await load()
}

async function removeLesson(lesson) {
  if (!confirm(`Supprimer la leçon "${lesson.titre}" ?`)) return
  await api.delete(`/formateur/lessons/${lesson.id}`)
  await load()
}

onMounted(load)
</script>

<template>
  <div v-if="course" class="card">
    <router-link to="/cours">&larr; Mes cours</router-link>
    <h2>{{ course.titre }}</h2>
    <p>{{ course.description || 'Aucune description.' }}</p>
  </div>

  <div v-if="course" class="card module-row">
    <h3>Ajouter un module</h3>
    <input v-model="newModuleTitre" placeholder="Titre du module" @keyup.enter="addModule" />
    <button @click="addModule">Ajouter le module</button>
  </div>

  <div v-if="course" v-for="m in course.modules" :key="m.id" class="card module-row">
    <h3>{{ m.titre }}
      <button class="danger" @click="removeModule(m)">Supprimer le module</button>
    </h3>

    <ul class="lesson-list">
      <li v-for="l in m.lessons" :key="l.id">
        <strong>{{ l.titre }}</strong> <span class="badge">{{ l.type }}</span>
        <button class="danger" @click="removeLesson(l)">Supprimer</button>
      </li>
    </ul>
    <p v-if="!m.lessons?.length" class="muted">Aucune leçon dans ce module.</p>

    <h4>Ajouter une leçon</h4>
    <input v-model="newLesson[m.id].titre" placeholder="Titre de la leçon" />
    <select v-model="newLesson[m.id].type">
      <option value="texte">Texte</option>
      <option value="video">Vidéo</option>
      <option value="pdf">PDF</option>
    </select>
    <input v-model="newLesson[m.id].contenu" placeholder="Contenu (texte) ou description" />

    <!-- Pour une vidéo ou un PDF : soit un lien (YouTube, PDF en ligne), soit un fichier -->
    <template v-if="newLesson[m.id].type !== 'texte'">
      <input v-model="newLesson[m.id].url_media" placeholder="Lien YouTube ou URL du média (optionnel)" />
      <label class="muted">Ou téléverser un fichier ({{ newLesson[m.id].type === 'pdf' ? 'PDF' : 'vidéo mp4/webm' }}) :</label>
      <input type="file" :key="uploadKey + '-' + m.id"
        :accept="newLesson[m.id].type === 'pdf' ? 'application/pdf' : 'video/*'"
        @change="onFile($event, m.id)" />
    </template>

    <button @click="addLesson(m)">Ajouter la leçon</button>
  </div>

  <p v-if="course && !course.modules?.length" class="muted">
    Aucun module. Ajoute ton premier module ci-dessus.
  </p>
</template>
