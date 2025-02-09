<script setup lang="ts">
import { ref, onMounted, h, watch, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

// **Ajout de la prop pour la liaison v-bind**
const props = defineProps<{ modelValue: string }>()

// **Ajout de l'emit pour mettre à jour le v-model**
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

// Récupération du paramètre "name" depuis l'URL
const route = useRoute()
const backupName = route.params.name as string

// Données réactives
const filesListed = ref<any[]>([])
const loading = ref(false)
const selectedFile = ref<string | null>(props.modelValue)

// Accès à l'API via useNuxtApp
const { $api } = useNuxtApp()

// Fonction pour récupérer la liste des fichiers du backup sélectionné
async function listLastBackup() {
  try {
    loading.value = true
    const response = await $api.get(`/api/backups/${backupName}/files`)
    if (response.status === 200) {
      console.log("Structure des fichiers renvoyée par l'API :", response.data)

      let files = response.data.files

      // Trier par date décroissante
      files.sort((a: any, b: any) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime())

      // Obtenir les trois derniers fichiers
      filesListed.value = files
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

// Surveille la sélection et met à jour le v-model
watch(selectedFile, (newVal) => {
  emit('update:modelValue', newVal as string)
})

// Fonction pour extraire uniquement le nom du fichier
const extractFilename = (key: string) => key.substring(key.lastIndexOf("/") + 1)

// Fonction pour formater la date
const formatDate = (dateString: string) => format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')

// Fonction pour formater la taille
const formatSize = (size: number) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} Mo`
  } else if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} Ko`
  }
  return `${size} octets`
}

// Définition des colonnes
const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    cell: ({ row }) =>
      h(Checkbox, {
        checked: selectedFile.value === row.original.Key,
        'onUpdate:checked': (checked: boolean) => {
          selectedFile.value = checked ? row.original.Key : null
          console.log("Fichier sélectionné :", selectedFile.value)
        },
        'aria-label': 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (file) => extractFilename(file.Key),
    id: 'filename',
    header: 'Nom du fichier',
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorFn: (file) => formatDate(file.LastModified),
    id: 'lastModified',
    header: 'Dernière modification',
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorFn: (file) => formatSize(file.Size),
    id: 'size',
    header: 'Taille',
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
      :pagination="true"
    />
  </div>
</template>
