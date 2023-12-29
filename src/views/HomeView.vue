<script lang="ts" setup>
import ReadME from '../../README.md'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const counterColor = computed(() => (globalStore.count > 0 ? 'text-indigo-400' : 'text-pink-300'))
</script>

<template>
  <div class="___ mx-auto prose">
    <ReadME />
    <h3 class="mb-5">
      Example of how you can use Pinia as your store manager:
    </h3>
    <div class="mb-2">
      Counter value is
      <span class="font-bold" :class="counterColor">{{ globalStore.count }}</span>
    </div>
    <div class="flex space-x-5">
      <BaseButton color="warning" label="Decrease Counter by 1" @click="globalStore.decreaseCounter()" />
      <BaseButton color="primary" label="Increase Counter by 1" @click="globalStore.incrementCounter()" />
    </div>
  </div>
</template>
