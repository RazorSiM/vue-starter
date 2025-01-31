<script lang="ts" setup>
import type { ButtonProps } from './types'
import { colorToClasses, sizeToClasses } from './types'

const { color = 'primary', size = 'md' } = defineProps<ButtonProps>()
</script>

<template>
  <button
    class="rounded-md transition"
    :class="[colorToClasses.get(color), sizeToClasses.get(size)]"
  >
    <slot />
  </button>
</template>
