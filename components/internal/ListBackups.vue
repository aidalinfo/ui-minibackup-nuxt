<script setup lang="ts">
import { ref, onMounted, h, watch, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import InteractiveHoverButton from '@/components/internal/InteractiveHoverButton.vue'
// **Ajout de la prop pour la liaison v-bind**
const props = defineProps<{ modelValue: string, download: boolean }>()

// **Ajout de l'emit pour mettre à jour le v-model**
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

// Récupération du paramètre "name" depuis l'URL
const route = useRoute()
const backupName = route.params.name as string

// Données réactives
const filesListed = ref<any[]>([])
const loading = ref(false)
const selectedFile = ref<string | null>(props.modelValue)
const downloadingFile = ref<string | null>(null) // Gère l'affichage du loader pour le téléchargement

// Accès à l'API via useNuxtApp
const { $api } = useNuxtApp()

// Fonction pour récupérer la liste des fichiers du backup sélectionné
async function listLastBackup() {
  try {
    loading.value = true
    const response = await $api.get(`/api/backups/${backupName}/files`)
    if (response.status === 200) {
      let files = response.data.files

      // Trier par date décroissante
      files.sort((a: any, b: any) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime())

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

// **Téléchargement avec gestion du loading**
async function downloadDecryptedFile(fileName: string) {
  try {
    downloadingFile.value = fileName // Active le loader pour ce fichier

    const response = await $api.get(`/api/download/${encodeURIComponent(fileName)}`, {
      responseType: "blob"
    });

    const blob = response.data;
    if (!(blob instanceof Blob)) {
      throw new Error("La réponse n'est pas un Blob valide !");
    }

    const cleanFileName = fileName.endsWith(".enc") ? fileName.slice(0, -4) : fileName;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement :", error);
  } finally {
    downloadingFile.value = null // Désactive le loader
  }
}

// **Définition des colonnes**
const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    cell: ({ row }) =>
      h(Checkbox, {
        checked: selectedFile.value === row.original.Key,
        'onUpdate:checked': (checked: boolean) => {
          selectedFile.value = checked ? row.original.Key : null
        },
        'aria-label': 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (file) => file.Key.split('/').pop(),
    id: 'filename',
    header: 'Nom du fichier',
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorFn: (file) => format(new Date(file.LastModified), 'yyyy-MM-dd HH:mm:ss'),
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
  ...(props.download
    ? [{
        id: 'download',
        header: 'Téléchargement',
        cell: ({ row }) => {
          const fileKey = row.original.Key;
          return h(InteractiveHoverButton, {
            text: 'Télécharger',
            class: 'w-48',
            onClick: () => downloadDecryptedFile(fileKey)
          }, () => [
            downloadingFile.value === fileKey
              ? h(Loader2, { class: "w-4 h-4 animate-spin mr-2" }) // Icône de chargement
              : null,
            "Télécharger"
          ]);
        }
      }]
    : [])
]

// **Fonction pour formater la taille**
function formatSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} Mo`;
  } else if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} Ko`;
  }
  return `${size} octets`;
}

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
