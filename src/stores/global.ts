import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
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
