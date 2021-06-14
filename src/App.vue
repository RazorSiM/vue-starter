<template>
  <component :is="layout" class="font-nunito">
    <router-view />
  </component>
</template>

<script>
import { defineComponent } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  setup() {
    const route = useRoute();
    const layout = computed(() => {
      return route.meta.layout;
    });
    return { layout };
  },
});
</script>
