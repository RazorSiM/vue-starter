<script lang="ts" setup>
// Each item carries both names: the label a visitor reads, and the file that
// produces the route. In a template whose headline feature is file-based routing,
// the `src/pages/<file>.vue` → URL mapping is worth showing rather than hiding — but
// `index` is a filename, not a description of the page, so the two are allowed to
// differ. The filename rides along in the tooltip.
const links = [
  { to: '/', label: 'readme', file: 'index.vue', icon: 'i-lucide-house' },
  { to: '/demo', label: 'demo', file: 'demo.vue', icon: 'i-lucide-flask-conical' },
  { to: '/layout', label: 'layout', file: 'layout.vue', icon: 'i-lucide-layout-template' },
  { to: '/changelog', label: 'changelog', file: 'changelog.vue', icon: 'i-lucide-rotate-ccw' },
] as const
</script>

<template>
  <nav aria-label="Pages" class="flex items-center gap-0.5">
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      :title="`src/pages/${link.file}`"
      class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-500 font-mono transition hover:(bg-gray-200/70 text-gray-900) focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:text-gray-400 dark:hover:(bg-gray-800 text-gray-100)"
      exact-active-class="bg-indigo-500/10 !text-indigo-600 dark:!text-indigo-300"
    >
      <div :class="link.icon" class="h-4 w-4" aria-hidden="true" />
      <span>{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>
