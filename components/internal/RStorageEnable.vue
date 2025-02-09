<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const rstorageCount = ref<number | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { $api } = useNuxtApp()

async function fetchRStorageCount() {
  try {
    loading.value = true
    error.value = null

    const response = await $api.get('/api/server/rstorage/count') 
    rstorageCount.value = response.data.rstorage_count
  } catch (err) {
    error.value = "Erreur lors de la récupération des données"
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRStorageCount()
})
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Serveurs de Stockage
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="text-sm text-muted-foreground">
        Chargement...
      </div>
      <div v-else-if="error" class="text-sm text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <div class="text-2xl font-bold">
          {{ rstorageCount !== null ? rstorageCount : 'N/A' }}
        </div>
        <p class="text-xs text-muted-foreground">
          Nombre total de serveurs actifs
        </p>
      </div>
    </CardContent>
  </Card>
</template>
