<script lang="ts" setup>
import { computed } from 'vue'

import { useCounterStore } from '@/stores/counter'

// Client state, for contrast with the panel above it: nothing here talks to a server,
// so there is no cache, no loading state and nothing to invalidate. That is the line
// between Pinia and TanStack Query, and it is the whole reason both are in the stack.
const counter = useCounterStore()

const countColor = computed(() =>
  counter.count > 0
    ? 'text-indigo-600 dark:text-indigo-400'
    : counter.count < 0
      ? 'text-pink-600 dark:text-pink-400'
      : 'text-gray-500',
)
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Counter is <span class="font-bold font-mono" :class="countColor">{{ counter.count }}</span>
    </p>
    <div class="flex gap-2">
      <UiButton color="warning" size="sm" @click="counter.decreaseCounter()">−1</UiButton>
      <UiButton size="sm" @click="counter.incrementCounter()">+1</UiButton>
    </div>
  </div>
</template>
