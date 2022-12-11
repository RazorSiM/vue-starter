<script lang="ts" setup>
defineOptions({
  name: 'EmptyLayout',
})
const route = useRoute()
</script>

<template>
  <TopNav />
  <slot />
</template>
