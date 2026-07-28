<script lang="ts" setup>
// Each item carries both names: the label a visitor reads, and the file that
// produces the route. In a template whose headline feature is file-based routing,
// the `src/pages/<file>.vue` → URL mapping is worth showing rather than hiding — but
// `index` is a filename, not a description of the page, so the two are allowed to
// differ. The filename rides along in the tooltip.
//
// That tooltip used to be a `title` attribute, which is the least accessible way to
// attach text to a control: it never opens on keyboard focus, never on touch, and
// screen readers treat it inconsistently. Reka's Tooltip renders real text, wires it
// to the link with aria-describedby, and opens on focus as well as hover.
const links = [
  { to: '/', label: 'readme', file: 'index.vue', icon: 'i-lucide-house' },
  { to: '/docs', label: 'docs', file: 'docs.vue', icon: 'i-lucide-book-open' },
  { to: '/demo', label: 'demo', file: 'demo.vue', icon: 'i-lucide-flask-conical' },
  { to: '/layout', label: 'layout', file: 'layout.vue', icon: 'i-lucide-layout-template' },
  { to: '/changelog', label: 'changelog', file: 'changelog.vue', icon: 'i-lucide-rotate-ccw' },
] as const
</script>

<template>
  <nav aria-label="Pages" class="flex items-center gap-0.5">
    <!-- TooltipRoot is renderless, so the RouterLink stays a direct flex child of the
         nav. `as-child` means the trigger *is* the link rather than a button wrapping
         one — no nested interactive elements. -->
    <TooltipRoot v-for="link in links" :key="link.to">
      <TooltipTrigger as-child>
        <RouterLink
          :to="link.to"
          class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-500 font-mono transition hover:(bg-gray-200/70 text-gray-900) focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:text-gray-400 dark:hover:(bg-gray-800 text-gray-100)"
          exact-active-class="bg-indigo-500/10 !text-indigo-600 dark:!text-indigo-300"
        >
          <div :class="link.icon" class="h-4 w-4" aria-hidden="true" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          :side-offset="6"
          class="z-100 rounded-md bg-gray-900 px-2 py-1 text-xs text-gray-50 font-mono shadow-lg dark:(bg-gray-100 text-gray-900)"
        >
          src/pages/{{ link.file }}
          <TooltipArrow class="fill-gray-900 dark:fill-gray-100" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </nav>
</template>
