<script lang="ts" setup>
definePage({
  meta: {
    layout: 'DefaultLayout',
    title: 'Demo',
    description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
  },
})

useHead({
  title: 'Demo',
  meta: [
    {
      name: 'description',
      content: 'TanStack Query, Form and Table with zod validation over a mocked API',
    },
  ],
})

// Route-level component: headings and composition only. Every piece of state lives
// in the components below.
const sections = [
  {
    id: 'data',
    title: 'Query + Table + Form',
    lead: 'One resource, four libraries.',
  },
  {
    id: 'client-state',
    title: 'Client state',
    lead: 'What is left for Pinia once the server state has an owner.',
  },
] as const
</script>

<template>
  <div class="space-y-12">
    <header class="space-y-3">
      <div class="flex items-center gap-2 text-xs text-gray-500 font-mono">
        <div class="i-lucide-flask-conical h-3.5 w-3.5" aria-hidden="true" />
        <span>src/pages/demo.vue</span>
      </div>
      <h1 class="text-3xl font-semibold tracking-tight">Demo</h1>
      <p class="max-w-2xl text-gray-600 leading-relaxed dark:text-gray-400">
        A members list wired end to end: <strong>zod</strong> defines the shape,
        <strong>MSW</strong> answers the requests, <strong>TanStack Query</strong> caches them,
        <strong>TanStack Table</strong> sorts and filters the result, and
        <strong>TanStack Form</strong> adds to it. No backend — the API lives in
        <code class="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono dark:bg-gray-800"
          >src/mocks/handlers.ts</code
        >
        and the same handlers serve the tests.
      </p>
    </header>

    <section :id="sections[0].id" class="space-y-4">
      <div class="space-y-1">
        <h2 class="text-sm text-gray-500 font-medium font-mono tracking-wide uppercase">
          {{ sections[0].title }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ sections[0].lead }}</p>
      </div>
      <DemoMembersPanel />
    </section>

    <section :id="sections[1].id" class="space-y-4">
      <div class="space-y-1">
        <h2 class="text-sm text-gray-500 font-medium font-mono tracking-wide uppercase">
          {{ sections[1].title }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ sections[1].lead }}</p>
      </div>
      <DemoCounterCard />
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
