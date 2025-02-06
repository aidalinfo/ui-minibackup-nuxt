<script setup lang="ts">
import { ref, onMounted, h, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'

// Déclarez l'emit pour transmettre la sélection vers le parent
const emit = defineEmits<{ (e: 'update:selectedBackup', value: any): void }>()

// Récupération du paramètre "name" depuis l'URL (ex: /restore/minio-data)
const route = useRoute()
const backupName = route.params.name as string

// Données réactives pour la liste des fichiers et l'état de chargement
const filesListed = ref<any[]>([])
const loading = ref(false)

// Variable réactive pour stocker le fichier sélectionné (single select)
const selectedFile = ref<any | null>(null)

// Accès à l'API via useNuxtApp
const { $api } = useNuxtApp()

// Fonction pour récupérer la liste des fichiers du backup sélectionné
async function listLastBackup() {
  try {
    loading.value = true
    const response = await $api.get(`/api/backups/${backupName}/files`)
    if (response.status === 200) {
      // Affichage de la structure renvoyée par l'API dans la console
      console.log("Structure des fichiers renvoyée par l'API :", response.data)
      const files = response.data.files
      // Trier les fichiers par ordre décroissant
      const sortedFiles = files.sort().reverse()
      // Obtenir les trois derniers fichiers
      filesListed.value = sortedFiles.slice(0, 3)
    } else {
      console.error(`Erreur lors de la récupération des fichiers pour ${backupName}`)
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des fichiers pour ${backupName}`, error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  listLastBackup()
})

// Surveille la sélection et émet la nouvelle valeur vers le parent
watch(selectedFile, (newVal) => {
  emit('update:selectedBackup', newVal)
  console.log("Emitted selected file:", newVal)
})

// Définition des colonnes pour GenericTable avec single select
const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    cell: ({ row }) =>
      h(Checkbox, {
        // La case est cochée si l'élément de la ligne correspond à la sélection
        checked: selectedFile.value === row.original,
        'onUpdate:checked': (checked: boolean) => {
          if (checked) {
            // Pour du single select, on remplace toute sélection par la nouvelle
            selectedFile.value = row.original
          } else {
            if (selectedFile.value === row.original) {
              selectedFile.value = null
            }
          }
          console.log("Fichier sélectionné :", selectedFile.value)
        },
        'aria-label': 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (file) => file,
    id: 'filename',
    header: 'Nom du fichier',
    cell: ({ getValue }) => getValue(),
  },
]
</script>

<template>
  <div>
    <GenericTable
      :data="filesListed"
      :columns="columns"
      :loading="loading"
    />
  </div>
</template>
