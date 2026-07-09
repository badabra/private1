<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const enAttente = ref([])
const message = ref('')
const chargement = ref(true)

async function charger() {
  chargement.value = true
  const { data } = await api.get('/admin/formateurs-en-attente')
  enAttente.value = data
  chargement.value = false
}

async function approuver(formateur) {
  message.value = ''
  const { data } = await api.post(`/admin/formateurs/${formateur.id}/approuver`)
  message.value = data.message
  await charger()
}

onMounted(charger)
</script>

<template>
  <div class="card">
    <h2>Approbation des formateurs</h2>
    <p class="muted">
      Les comptes formateur créés via l'inscription publique doivent être approuvés
      ici avant de devenir actifs.
    </p>

    <p v-if="message" class="succes">{{ message }}</p>

    <p v-if="chargement" class="muted">Chargement…</p>

    <template v-else>
      <p v-if="!enAttente.length" class="muted">Aucun formateur en attente pour le moment.</p>

      <ul class="liste">
        <li v-for="f in enAttente" :key="f.id">
          <div>
            <strong>{{ f.name }}</strong><br />
            <span class="muted">{{ f.email }}</span>
          </div>
          <button @click="approuver(f)">Approuver</button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.muted { color: #64748b; font-size: 14px; }
.succes { color: #15803d; background: #dcfce7; border: 1px solid #bbf7d0;
  padding: 8px 12px; border-radius: 6px; }
.liste { list-style: none; padding: 0; margin: 12px 0 0; }
.liste li { display: flex; justify-content: space-between; align-items: center;
  gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee; }
.liste button { padding: 8px 14px; cursor: pointer; }
</style>
