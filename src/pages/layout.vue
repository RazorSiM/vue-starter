<script lang="ts" setup>
definePage({
  meta: {
    layout: 'EmptyLayout',
    title: 'Layouts',
    description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
  },
})

const { active, declared, override, setLayout, layouts } = useLayout()
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-3">
      <div class="flex items-center gap-2 text-xs text-gray-500 font-mono">
        <div class="i-lucide-layout-template h-3.5 w-3.5" aria-hidden="true" />
        <span>src/pages/layout.vue</span>
      </div>
      <h1 class="text-3xl font-semibold tracking-tight">Layouts</h1>
      <p class="max-w-2xl text-gray-600 leading-relaxed dark:text-gray-400">
        Every page picks the frame it renders inside.
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >src/App.vue</code
        >
        reads
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >route.meta.layout</code
        >
        and resolves it against
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >src/layouts/</code
        >
        with a glob import, so adding a layout is adding a file.
      </p>
    </header>

    <section class="space-y-4">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="text-sm text-gray-500 font-medium font-mono tracking-wide uppercase">Try it</h2>
        <p class="text-xs text-gray-500 font-mono">
          rendering in <span class="text-indigo-600 dark:text-indigo-400">{{ active }}</span>
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <button
          v-for="option in layouts"
          :key="option.name"
          type="button"
          class="group rounded-xl border p-4 text-left transition focus-visible:(outline-2 outline-indigo-500 outline-offset-2)"
          :class="
            active === option.name
              ? 'border-indigo-500 bg-indigo-500/5 dark:border-indigo-400'
              : 'border-gray-200 hover:border-gray-300 dark:(border-gray-800 hover:border-gray-700)'
          "
          :aria-pressed="active === option.name"
          @click="setLayout(option.name)"
        >
          <!-- Miniature of the frame each layout renders. -->
          <div
            class="mb-3 aspect-[16/7] flex flex-col gap-1 overflow-hidden border border-gray-200 rounded-lg bg-gray-100 p-1.5 dark:(border-gray-800 bg-gray-900)"
          >
            <div
              v-if="option.name === 'DefaultLayout'"
              class="h-2.5 flex shrink-0 items-center gap-1 rounded bg-gray-300 px-1 dark:bg-gray-700"
            >
              <div class="h-1 w-1 rounded-full bg-indigo-500" />
              <div class="ml-auto h-1 w-4 rounded-full bg-gray-400 dark:bg-gray-600" />
            </div>
            <div class="flex-1 rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-mono font-medium">{{ option.name }}</span>
            <div
              v-if="active === option.name"
              class="i-lucide-check h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500 leading-relaxed dark:text-gray-400">
            {{ option.summary }}
          </p>
          <ul class="mt-2 flex flex-wrap gap-1">
            <li
              v-for="item in option.provides"
              :key="item"
              class="rounded bg-gray-200/70 px-1.5 py-0.5 text-[11px] text-gray-600 font-mono dark:(bg-gray-800 text-gray-400)"
            >
              {{ item }}
            </li>
          </ul>
        </button>
      </div>

      <p v-if="override" class="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-mono">
        <span
          >previewing an override — this route declares
          <span class="text-gray-700 dark:text-gray-300">{{ declared }}</span></span
        >
        <button
          type="button"
          class="rounded px-1.5 py-0.5 text-indigo-600 underline underline-offset-2 transition hover:bg-indigo-500/10 focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:text-indigo-400"
          @click="setLayout(null)"
        >
          reset
        </button>
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-sm text-gray-500 font-medium font-mono tracking-wide uppercase">
        Make it permanent
      </h2>
      <p class="max-w-2xl text-sm text-gray-600 leading-relaxed dark:text-gray-400">
        The switch above is a preview and resets when you navigate. To fix a layout to a route,
        declare it in the page itself — the value is type-checked against the
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >RouteMeta</code
        >
        union in
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >src/types/router.d.ts</code
        >.
      </p>
      <pre
        class="overflow-x-auto border border-gray-200 rounded-lg bg-gray-100 p-4 text-xs leading-relaxed dark:(border-gray-800 bg-gray-900)"
      ><code>definePage({
  meta: {
    layout: 'EmptyLayout',
  },
})</code></pre>
    </section>

    <RouterLink
      to="/"
      class="inline-flex items-center gap-1.5 text-sm text-gray-500 font-mono transition hover:text-gray-900 focus-visible:(outline-2 outline-indigo-500 outline-offset-2) dark:hover:text-gray-100"
    >
      <div class="i-lucide-arrow-left h-3.5 w-3.5" aria-hidden="true" />
      <span>index</span>
    </RouterLink>
  </div>
</template>
