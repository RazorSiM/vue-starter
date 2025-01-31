<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'
import ReadME from '../../README.md'

const counterStore = useCounterStore()
const counterColor = computed(() => (counterStore.count > 0 ? 'text-indigo-400' : 'text-pink-300'))

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
  <div class="___ mx-auto prose">
    <ReadME />
    <h3 class="mb-5">
      Example of how you can use Pinia as your store manager:
    </h3>
    <div class="mb-2">
      Counter value is
      <span class="font-bold" :class="counterColor">{{ counterStore.count }}</span>
    </div>
    <div class="flex space-x-5">
      <UiButton color="warning" @click="counterStore.decreaseCounter()">
        Decrease Counter by 1
      </UiButton>
      <UiButton @click="counterStore.incrementCounter()">
        Increase Counter by 1
      </UiButton>
    </div>
  </div>
</template>
