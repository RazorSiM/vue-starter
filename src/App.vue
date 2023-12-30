<script lang="ts" setup>
const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || 'DefaultLayout'
})
const title = computed(() => {
  return route.meta.title ?? ''
})
const description = computed(() => {
  return route.meta.description ?? ''
})

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogDescription: () => description.value,
  ogTitle: () => title.value,
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
