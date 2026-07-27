<script lang="ts" setup>
import type { SortingState } from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'

import type { Member } from '@/schemas/member'

const props = defineProps<{ members: Member[]; removingId?: string }>()
const emit = defineEmits<{ remove: [id: string] }>()

// Sorting and the filter box are view state, so they live here rather than in the
// panel — nothing above this component needs to know how the rows are ordered.
const sorting = ref<SortingState>([])
const globalFilter = ref('')

const columnHelper = createColumnHelper<Member>()

const columns = [
  columnHelper.accessor('name', { header: 'name' }),
  columnHelper.accessor('email', { header: 'email' }),
  columnHelper.accessor('role', { header: 'role' }),
  columnHelper.accessor('commits', { header: 'commits' }),
  columnHelper.accessor('joinedAt', { header: 'joined' }),
]

const table = useVueTable({
  // Getters, not plain values: this is how vue-table v8 stays reactive. Passing
  // `props.members` directly would snapshot the array at setup time and never update.
  get data() {
    return props.members
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  globalFilterFn: 'includesString',
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

const sortIndicator = { asc: '↑', desc: '↓' } as const
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <input
        :value="globalFilter"
        type="search"
        placeholder="Filter every column…"
        aria-label="Filter members"
        class="w-full border border-gray-200 rounded-lg bg-white px-3 py-2 text-sm transition sm:w-64 focus-visible:(outline-2 outline-indigo-500 outline-offset-0) dark:(border-gray-800 bg-gray-950)"
        @input="table.setGlobalFilter(($event.target as HTMLInputElement).value)"
      />
      <p class="text-xs text-gray-500 font-mono">
        {{ table.getFilteredRowModel().rows.length }} / {{ props.members.length }} rows
      </p>
    </div>

    <!-- The table scrolls inside its own box so the page body never scrolls sideways. -->
    <div class="overflow-x-auto border border-gray-200 rounded-xl dark:border-gray-800">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 dark:(border-gray-800 bg-gray-900/50)">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              scope="col"
              class="px-3 py-2 text-xs text-gray-500 font-medium font-mono"
            >
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded transition hover:text-gray-900 focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:hover:text-gray-100"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                <span aria-hidden="true">{{
                  sortIndicator[header.column.getIsSorted() as 'asc' | 'desc'] ?? ''
                }}</span>
              </button>
            </th>
            <th scope="col" class="px-3 py-2"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b border-gray-100 last:border-0 dark:border-gray-800/60"
          >
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-3 py-2">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
            <td class="px-3 py-2 text-right">
              <!-- Removal is destructive and used to happen on a single click. An alert
                   dialog is the one place hand-written markup almost always gets wrong:
                   it has to trap Tab inside itself, restore focus to the trigger on
                   close, respond to Escape, and mark the rest of the page inert. Reka
                   does all four; the only obligations left are a Title and a
                   Description, which it wires up as the dialog's accessible name. -->
              <AlertDialogRoot>
                <AlertDialogTrigger
                  type="button"
                  class="rounded px-1.5 py-0.5 text-xs text-gray-500 font-mono transition hover:(bg-red-500/10 text-red-600) focus-visible:(outline-2 outline-indigo-500 outline-offset-2) disabled:opacity-40 dark:hover:text-red-400"
                  :disabled="props.removingId === row.original.id"
                  :aria-label="`Remove ${row.original.name}`"
                >
                  {{ props.removingId === row.original.id ? 'removing…' : 'remove' }}
                </AlertDialogTrigger>

                <AlertDialogPortal>
                  <AlertDialogOverlay class="fixed inset-0 z-100 bg-gray-950/40 backdrop-blur-sm" />
                  <AlertDialogContent
                    class="fixed left-1/2 top-1/2 z-101 max-w-[calc(100vw-2rem)] w-96 translate-x--1/2 translate-y--1/2 border border-gray-200 rounded-xl bg-white p-6 text-left shadow-xl dark:(border-gray-800 bg-gray-950)"
                  >
                    <AlertDialogTitle class="text-base font-semibold">
                      Remove {{ row.original.name }}?
                    </AlertDialogTitle>
                    <AlertDialogDescription
                      class="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-400"
                    >
                      This deletes the row from the in-memory MSW database for this session. Reload
                      the page and the seeded data is back.
                    </AlertDialogDescription>
                    <div class="mt-5 flex justify-end gap-2">
                      <AlertDialogCancel as-child>
                        <UiButton color="secondary" size="sm">Cancel</UiButton>
                      </AlertDialogCancel>
                      <AlertDialogAction as-child>
                        <UiButton color="danger" size="sm" @click="emit('remove', row.original.id)">
                          Remove
                        </UiButton>
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialogRoot>
            </td>
          </tr>

          <tr v-if="!table.getRowModel().rows.length">
            <td colspan="6" class="px-3 py-8 text-center text-sm text-gray-500">
              Nothing matches that filter.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
