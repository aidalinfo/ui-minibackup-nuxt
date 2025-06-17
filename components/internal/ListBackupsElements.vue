<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'
import { ref, onMounted, h } from 'vue'
import { useNuxtApp } from '#app'
import { toast } from 'vue-sonner'
import SkeletonTable from './SkeletonTable.vue'

const router = useRouter()
const { $api } = useNuxtApp()

interface Backup {
  name: string
  type: string
  Path: { S3: string }
  Schedule: { Standard: string }
}

const backupsList = ref<Backup[]>([])
const loadingBackups = ref(false)
const runningBackup = ref<string | null>(null)

async function fetchBackups() {
  try {
    loadingBackups.value = true
    const response = await $api.get('/api/backups/all')
    if (response.data && response.data.backup) {
      backupsList.value = Object.keys(response.data.backup).map((key) => ({
        name: key,
        ...response.data.backup[key],
      }))
    }
  } catch (err) {
    toast.error('Erreur lors du chargement des sauvegardes')
  } finally {
    loadingBackups.value = false
  }
}

async function runBackup(name: string) {
  runningBackup.value = name
  try {
    await $api.post(`/api/backup/${encodeURIComponent(name)}/run`)
    toast.success(`Sauvegarde "${name}" lancée avec succès !`)
  } catch (err) {
    toast.error(`Erreur lors du lancement de la sauvegarde "${name}"`)
  } finally {
    runningBackup.value = null
  }
}

onMounted(() => {
  fetchBackups()
})

async function restoreBackup(backup: Backup) {
  router.push(`/restore/${backup.name}`)
}

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
      return h('div', { class: 'flex gap-2' }, [
        h(Button, {
          class: 'w-32',
          onClick: () => restoreBackup(backup)
        }, () => 'Restaurer'),
        h(Button, {
          class: 'w-40',
          disabled: runningBackup.value === backup.name,
          onClick: () => runBackup(backup.name)
        }, () => runningBackup.value === backup.name ? 'En cours...' : 'Sauvegarder')
      ])
    },
  },
]
</script>

<template>
  <div>
    <SkeletonTable
      :data="backupsList"
      :columns="columns"
      :loading="loadingBackups"
      :pagination="false"
    />
  </div>
</template>