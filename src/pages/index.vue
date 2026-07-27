<script lang="ts" setup>
import ReadME from '../../README.md'

definePage({
  meta: {
    layout: 'DefaultLayout',
    title: 'Home',
    description: 'Vue Starter Template by Simone Colabufalo - github.com/RazorSiM',
  },
})

useHead({
  title: 'Vue Starter',
  meta: [
    {
      name: 'description',
      content: 'Vue Starter',
    },
  ],
})
</script>

<template>
  <!-- The README, rendered as a Vue component by unplugin-vue-markdown. The live
       examples moved to /demo so this page stays the document people came to read. -->
  <div class="prose max-w-none dark:prose-invert">
    <ReadME />
  </div>
</template>
