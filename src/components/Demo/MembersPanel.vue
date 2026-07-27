<script lang="ts" setup>
import { ref } from 'vue'

import type { NewMember } from '@/schemas/member'

// Feature container: it owns the server state and the loading/error branches, and
// hands plain data down. The form and the table below it stay presentational.
const simulateError = ref(false)

const {
  members,
  isPending,
  isFetching,
  error,
  refetch,
  addMember,
  removeMember,
  isAdding,
  removingId,
} = useMembers({ simulateError })

async function onSubmit(value: NewMember) {
  await addMember(value)
}

async function onRemove(id: string) {
  await removeMember(id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <label class="flex cursor-pointer items-center gap-2 text-xs text-gray-500 font-mono">
        <input v-model="simulateError" type="checkbox" class="accent-indigo-500" />
        simulate a 500
      </label>
      <p v-if="isFetching" class="text-xs text-indigo-600 font-mono dark:text-indigo-400">
        fetching…
      </p>
    </div>

    <div
      v-if="error"
      class="border border-red-200 rounded-xl bg-red-50 p-4 dark:(border-red-900/60 bg-red-950/30)"
    >
      <p class="text-sm text-red-700 font-medium dark:text-red-300">{{ error.message }}</p>
      <p class="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
        The query threw, so TanStack Query holds the error until the next successful fetch. Retries
        are off in <code class="font-mono">useMembers()</code> so this is visible immediately.
      </p>
      <button
        type="button"
        class="mt-3 rounded-lg border border-red-300 px-2.5 py-1 text-xs text-red-700 font-mono transition hover:bg-red-500/10 dark:(border-red-800 text-red-300)"
        @click="refetch()"
      >
        retry
      </button>
    </div>

    <p v-else-if="isPending" class="text-sm text-gray-500 font-mono">loading members…</p>

    <template v-else>
      <DemoMemberTable :members="members" :removing-id="removingId" @remove="onRemove" />

      <div class="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h3 class="mb-4 text-sm text-gray-500 font-medium font-mono tracking-wide uppercase">
          Add a member
        </h3>
        <DemoMemberForm :pending="isAdding" @submit="onSubmit" />
      </div>
    </template>
  </div>
</template>
