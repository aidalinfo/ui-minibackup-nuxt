<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useNuxtApp } from '#app'
import GenericTable from './GenericTable.vue'

interface Backup {
  name: string
  type: string
  Path: { S3: string }
  Schedule: { Standard: string }
}

const backups = ref<Backup[]>([])
const loading = ref(false)

defineProps<{
  columns: ColumnDef<any>[],
  pagination: boolean
}>()


const { $api } = useNuxtApp()

async function loadData() {
  try {
    loading.value = true
    const response = await $api.get('/api/backups/all')
    if (response.data && response.data.backup) {
      backups.value = Object.keys(response.data.backup).map((key) => ({
        name: key,
        ...response.data.backup[key],
      }))
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <GenericTable
      :data="backups"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
    />
  </div>
</template>
