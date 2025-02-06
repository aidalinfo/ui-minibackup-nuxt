<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useNuxtApp } from '#app'
import GenericTable from './GenericTable.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronDown, ArrowUpDown } from 'lucide-vue-next'
import InteractiveHoverButton from '@/components/internal/InteractiveHoverButton.vue' // <-- Import

interface Backup {
  name: string
  type: string
  Path: { S3: string }
  Schedule: { Standard: string }
}

// 1. Données réactives
const backups = ref<Backup[]>([])
const loading = ref(false)

// 2. Colonnes
const columns: ColumnDef<Backup>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'Type',
    header: 'Type',
  },
  {
    accessorFn: (row) => row.Path.S3,
    id: 's3',
    header: 'Stockage S3',
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorFn: (row) => row.Schedule.Standard,
    id: 'cron',
    header: () => h(Button, {
      variant: 'ghost'
    }, () => ['Cron Standard', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ getValue }) => getValue(),
  },
  {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const backup = row.original
    return h(InteractiveHoverButton, {
      class: 'w-32',           // Largeur si texte long, par ex.
      text: 'Restaurer',       // Le texte à afficher
      onClick: () => restoreBackup(backup) // Au clic, on déclenche la restauration
    })
  },
},
]

// 3. Fetcher les données via ton plugin axios
const { $api } = useNuxtApp()

async function loadData() {
  try {
    loading.value = true
    const response = await $api.get('/api/backups/all')
    // Suppose que ton API renvoie { backup: { backup1: {...}, backup2: {...} } }
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

const router = useRouter()

async function restoreBackup(backup: Backup) {
  router.push(`/restore/${backup.name}`)
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
    />
  </div>
</template>
