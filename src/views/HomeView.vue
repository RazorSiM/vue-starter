<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const counterColor = computed(() =>
  globalStore.count > 0 ? 'text-indigo-400' : 'text-pink-300',
)
</script>

<template>
  <div class="prose dark:prose-light">
    <h1>Vite Starter for vue 👑</h1>
    <h2>Batteries included!</h2>

    With this starter you only get a base scaffolding to start fiddeling with
    <strong>Vue3</strong>, <strong>UnoCSS</strong> and <strong>Vite</strong>.
    Code quality is managed by:
    <ul>
      <li>Typescript</li>
      <li>Eslint</li>
      <li>Lefthook</li>
    </ul>

    Other packages included:
    <ul>
      <li>UnoCSS because it's amazing</li>
      <li>Pinia as a store</li>
      <li>Vue-Router for the routing</li>
      <li>VueUse for some good and usefull hooks</li>
    </ul>
  </div>
  <div class="mb-5">
    Example of how you can use Pinia as your store manager:
  </div>
  <div class="mb-2">
    Counter value is
    <span class="font-bold" :class="counterColor">{{ globalStore.count }}</span>
  </div>
  <div class="flex space-x-5">
    <BaseButton
      color="warning"
      label="Decrease Counter by 1"
      @click="globalStore.decreaseCounter()"
    />
    <BaseButton
      color="primary"
      label="Increase Counter by 1"
      @click="globalStore.incrementCounter()"
    />
  </div>
</template>
