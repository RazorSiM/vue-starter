<template>
  <div
    class="
      w-full
      min-h-screen
      text-gray-900
      transition
      duration-100
      bg-gray-50
      dark:bg-gray-900 dark:text-gray-50
    "
  >
    <div class="flex items-center p-[30px] space-x-5">
      <div>Imagine this is a great Header</div>
      <button
        class="
          px-3
          py-2
          font-bold
          leading-none
          transition
          bg-pink-500
          rounded-lg
          dark:bg-indigo-500
          focus:outline-none
          dark:hover:bg-indigo-900
          hover:bg-pink-900
        "
        @click="toggleDark"
      >
        If you click here you toggle the dark mode
      </button>
    </div>

    <div class="container p-10 mx-auto">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useDark, useToggle } from "@vueuse/core";
export default defineComponent({
  component: {
    name: "BaseLayout",
  },
  setup() {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    return { toggleDark };
  },
});
</script>
