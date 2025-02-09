<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'


const backupData = ref<{ name: string; time: string } | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { $api } = useNuxtApp()

async function fetchNextBackup() {
  try {
    loading.value = true
    error.value = null

    const response = await $api.get('/api/backup/next-backup')
    backupData.value = response.data
  } catch (err) {
    error.value = "Erreur lors de la récupération des données"
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNextBackup()
})
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        Prochaine sauvegarde
      </CardTitle>
      <Users class="h-4 w-4 text-muted-foreground" />
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
          {{ backupData?.name || 'Aucun backup trouvé' }}
        </div>
        <p class="text-xs text-muted-foreground">
          {{ backupData?.time ? new Date(backupData.time).toLocaleString() : '' }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
