<script lang="ts" setup>
import Changelog from '../../CHANGELOG.md'

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
  <div class="mx-auto prose">
    <Changelog />
  </div>
</template>
