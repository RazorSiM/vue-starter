<script lang="ts" setup>
import type { ButtonProps } from './types'
import { colorToClasses, sizeToClasses } from './types'

const {
  as = 'button',
  asChild = false,
  color = 'primary',
  size = 'md',
} = defineProps<ButtonProps>()
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    class="rounded-md transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="[colorToClasses.get(color), sizeToClasses.get(size)]"
  >
    <slot />
  </Primitive>
</template>
