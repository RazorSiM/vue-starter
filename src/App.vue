<script lang="ts" setup>
import type { Component } from 'vue'

// Replaces the old app.component('DefaultLayout', ...) global registrations that
// used to live in the entry file. Adding src/layouts/Foo.vue is all it takes.
const layouts = import.meta.glob<{ default: Component }>('./layouts/*.vue', { eager: true })

const route = useRoute()
const { active, setLayout } = useLayout()

// A layout override is a demo affordance, not navigation state — drop it on route change.
watch(
  () => route.path,
  () => setLayout(null),
)

const layout = computed(() => layouts[`./layouts/${active.value}.vue`]?.default)
const title = computed(() => route.meta.title ?? '')
const description = computed(() => route.meta.description ?? '')

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogDescription: () => description.value,
  ogTitle: () => title.value,
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
