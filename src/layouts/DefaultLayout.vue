<script lang="ts" setup>
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

// The header doubles as a live demo of file-based routing: it shows which file
// under src/pages/ produced the URL you are looking at.
const route = useRoute()
const sourceFile = computed(() => {
  const segment = route.path === '/' ? 'index' : route.path.replace(/^\//, '').replaceAll('/', '.')
  return `src/pages/${segment}.vue`
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 text-gray-900 font-sans transition-colors dark:(bg-gray-950 text-gray-100)"
  >
    <header
      class="sticky top-0 z-50 border-b border-gray-200 bg-gray-50/85 backdrop-blur dark:(border-gray-800 bg-gray-950/85)"
    >
      <div class="mx-auto max-w-3xl flex items-center gap-4 px-6 py-3">
        <div class="min-w-0 flex items-center gap-3">
          <span class="text-sm font-mono font-semibold tracking-tight">vue-starter</span>
          <span
            class="hidden items-center gap-1.5 text-xs text-gray-500 font-mono sm:inline-flex dark:text-gray-500"
          >
            <span class="truncate">{{ sourceFile }}</span>
            <div class="i-lucide-arrow-right h-3 w-3 shrink-0" aria-hidden="true" />
            <span class="text-indigo-600 dark:text-indigo-400">{{ route.path }}</span>
          </span>
        </div>

        <div class="ml-auto flex items-center gap-1">
          <TopNav />
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 transition hover:(bg-gray-200/70 text-gray-900) focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:text-gray-400 dark:hover:(bg-gray-800 text-gray-100)"
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            :aria-pressed="isDark"
            @click="toggleDark()"
          >
            <div :class="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
