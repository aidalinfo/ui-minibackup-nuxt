<!-- file: components/GenericTable.vue -->
<script setup lang="ts">
import { defineProps, computed } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  type ColumnDef,
} from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'

// On déclare un type générique T pour la forme des données.
// Si tu veux simplifier, tu peux mettre "any" à la place de T.
interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
}

const props = defineProps<TableProps<any>>() // ou <Backup>, etc.

// 1. On initialise TanStack Table
const tableData = computed(() => props.data) // devient réactif
const table = useVueTable({
  data: tableData,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
</script>

<template>
  <div>
    <!-- Loader -->
    <div v-if="props.loading" class="py-2">
      Chargement...
    </div>

    <!-- Le tableau -->
    <div v-else>
      <table class="table-auto w-full text-sm">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 py-2 border-b text-left"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="table.getRowModel().rows.length">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-4 py-2 border-b text-left"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>
          </template>
          <!-- Cas vide -->
          <tr v-else>
            <td :colspan="props.columns.length" class="p-4 text-center">
              Aucune donnée
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Ex. Pagination -->
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 text-sm text-muted-foreground">
          {{ table.getFilteredSelectedRowModel().rows.length }} /
          {{ table.getFilteredRowModel().rows.length }} sélectionné(s).
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Suivant
        </Button>
      </div>

    </div>
  </div>
</template>
