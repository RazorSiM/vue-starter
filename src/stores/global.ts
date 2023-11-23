import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const count = ref(0)
  const globalLoader = ref(false)
  const globalError = ref({ status: false, message: '' })

  const incrementCounter = () => {
    count.value++
  }
  const decreaseCounter = () => {
    count.value--
  }
  const runGlobalAsync = async (
    callback: (...args: unknown[]) => Promise<boolean>,
    errorMessage: string,
  ) => {
    try {
      globalLoader.value = true
      await callback()
    }
    catch (error) {
      globalError.value = { status: true, message: errorMessage }
    }
    finally {
      globalLoader.value = false
    }
  }
  return {
    count,
    globalLoader,
    globalError,
    incrementCounter,
    decreaseCounter,
    runGlobalAsync,
  }
})
