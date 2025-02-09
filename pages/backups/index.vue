<script setup lang="ts">
import { ChevronDown, ArrowUpDown } from 'lucide-vue-next'
import InteractiveHoverButton from '@/components/internal/InteractiveHoverButton.vue' 
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'

const router = useRouter()
interface Backup {
  name: string
  type: string
  Path: { S3: string }
  Schedule: { Standard: string }
}


async function details(backup: Backup) {
  router.push(`/backups/${backup.name}`)
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
      text: 'Détails',       // Le texte à afficher
      onClick: () => details(backup) // Au clic, on déclenche la restauration
    })
  },
},
]
</script>
<template>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="min-h-[100vh] flex-1 rounded-xl  md:min-h-min">
          <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>Sauvegardes</CardTitle>
            <CardDescription>
              Résumé des sauvegardes actives.
            </CardDescription>
          </div>
          <!-- <Button as-child size="sm" class="ml-auto gap-1">
            <a href="#">
              View All
              <ArrowUpRight class="h-4 w-4" />
            </a>
          </Button> -->
        </CardHeader>

        <CardContent>
          <IDataTable :columns="columns" :pagination="true"/>
        </CardContent>

        <!-- Le composant BorderBeam appliqué en superposition -->
        <BorderBeam :size="250" :duration="12" :delay="0" :border-width="2" colorFrom="#ffaa40" colorTo="#9c40ff" />
      </Card>
        </div>
      </div>
</template>