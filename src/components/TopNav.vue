<script lang="ts" setup>
// Nav items are labelled by the file that produces them, not by a friendly name.
// In a template whose headline feature is file-based routing, the mapping from
// `src/pages/<file>.vue` to a URL is the thing worth teaching.
const links = [
  { to: '/', file: 'index', icon: 'i-lucide-house' },
  { to: '/demo', file: 'demo', icon: 'i-lucide-flask-conical' },
  { to: '/changelog', file: 'changelog', icon: 'i-lucide-rotate-ccw' },
  { to: '/about', file: 'about', icon: 'i-lucide-layout-template' },
] as const
</script>

<template>
  <nav aria-label="Pages" class="flex items-center gap-0.5">
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-500 font-mono transition hover:(bg-gray-200/70 text-gray-900) focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:text-gray-400 dark:hover:(bg-gray-800 text-gray-100)"
      exact-active-class="bg-indigo-500/10 !text-indigo-600 dark:!text-indigo-300"
    >
      <div :class="link.icon" class="h-4 w-4" aria-hidden="true" />
      <span>{{ link.file }}</span>
    </RouterLink>
  </nav>
</template>
