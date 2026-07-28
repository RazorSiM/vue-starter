<script lang="ts" setup>
import Reference from '../../docs/reference.md'

definePage({
  meta: {
    layout: 'DefaultLayout',
    title: 'Docs',
    description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
  },
})

useHead({
  title: 'Docs',
  meta: [
    {
      name: 'description',
      content: 'Vue Starter reference: rationale, bundle costs and the sharp edges',
    },
  ],
})
</script>

<template>
  <!-- The long-form half of the README. It lives outside src/pages/ so the router,
       which is scoped to `extensions: ['.vue']`, never treats it as a route of its own. -->
  <div class="prose max-w-none dark:prose-invert">
    <Reference />
  </div>
</template>
