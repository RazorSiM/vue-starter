import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function incrementCounter() {
    count.value++
  }
  function decreaseCounter() {
    count.value--
  }

  return {
    count,
    incrementCounter,
    decreaseCounter,

  }
})
