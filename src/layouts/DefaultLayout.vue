<script setup lang="ts">
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 w-full transition text-gray-900 duration-100 dark:(bg-gray-900 text-gray-50) font-sans"
  >
    <header
      class="flex gap-5 p-[30px] items-center justify-between container mx-auto"
    >
      <TopNav />
      <button
        class="rounded-full font-bold hover:(bg-yellow-200) leading-none py-2 px-2 transition focus:outline-none hover:dark:(bg-indigo-900)"
        @click="toggleDark()"
      >
        <div v-if="!isDark" class="i-fluent-emoji-new-moon h-10 w-10" />
        <div v-else class="i-fluent-emoji-sun h-10 w-10" />
      </button>
    </header>

    <div class="container mx-auto p-10">
      <slot />
    </div>
  </div>
</template>
