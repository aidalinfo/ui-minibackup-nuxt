<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronDown, ArrowUpDown } from 'lucide-vue-next'
import InteractiveHoverButton from '@/components/internal/InteractiveHoverButton.vue'
const router = useRouter()
interface Backup {
  name: string
  type: string
  Path: { S3: string }
  Schedule: { Standard: string }
}


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
    return h(InteractiveHoverButton, {
      class: 'w-32',           // Largeur si texte long, par ex.
      text: 'Restaurer',       // Le texte à afficher
      onClick: () => restoreBackup(backup) // Au clic, on déclenche la restauration
    })
  },
},
]
</script>
<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <ClientOnly>
        <BlurReveal :delay="0.2" :duration="0.75" class="">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl leading-none">
            Tableau de bord 🚀 </h2>
        </BlurReveal>
      </ClientOnly>
      <NextBackup/>

      <RStorageEnable/>
    </div>
    <div class="grid gap-4 md:gap-8">
      <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>Sauvegardes</CardTitle>
            <CardDescription>
              Résumé des sauvegardes actives.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <IDataTable :columns="columns" :pagination="false"/>
        </CardContent>

        <BorderBeam :size="250" :duration="12" :delay="0" :border-width="2" colorFrom="#ffaa40" colorTo="#9c40ff" />
      </Card>
      <div>
    </div>
    </div>
  </main>
</template>