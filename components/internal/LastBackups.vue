<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const result = ref<{ backups: { timestamp: string; backupName: string }[] }>({ backups: [] })
const loading = ref(false)

const { $api } = useNuxtApp()
async function loadData() {
  try {
    loading.value = true
    const response = await $api.get('/api/backups/last-logs')
    console.log(response)
    result.value = response.data
  } catch (err) {
    console.log("Error", err)
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Les dernières sauvegardes</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div 
        v-for="(backup, index) in result.backups" 
        :key="index" 
        class="flex items-center gap-4"
      >
        <!-- Avatar (optionnel, peut être statique ou lié aux données) -->
        <Avatar class="hidden h-9 w-9 sm:flex">
          <AvatarImage src="/avatars/backup-icon.png" alt="Backup" />
          <AvatarFallback>{{ backup.backupName[0] }}</AvatarFallback>
        </Avatar>

        <!-- Contenu dynamique -->
        <div class="grid gap-1">
          <p class="text-sm font-medium leading-none">{{ backup.backupName }}</p>
          <p class="text-sm text-muted-foreground">{{ new Date(backup.timestamp).toLocaleString() }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
