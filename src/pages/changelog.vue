<script lang="ts" setup>
import Changelog from '../../CHANGELOG.md'

definePage({
  meta: {
    layout: 'DefaultLayout',
    title: 'Changelog',
    description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
  },
})

useHead({
  title: 'Changelog',
  meta: [
    {
      name: 'description',
      content: 'Vue Starter changelog',
    },
  ],
})
</script>

<template>
  <div class="prose max-w-none dark:prose-invert">
    <Changelog />
  </div>
</template>
