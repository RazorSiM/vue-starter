<template>
  <div class="prose dark:prose-dark">
    <h1>Vite Starter for vue 👑</h1>
    <h2>Batteries included!</h2>

    With this starter you only get a base scaffolding to start fiddeling with
    <strong>Vue3</strong>, <strong>WindiCSS</strong> and <strong>Vite</strong>.
    Code quality is managed by:
    <ul>
      <li>Typescript</li>
      <li>Eslint</li>
      <li>Stylelint</li>
      <li>Prettier</li>
      <li>Lefthook</li>
    </ul>

    Other packages included:
    <ul>
      <li>WindiCSS because it's amazing</li>
      <li>Pinia as a store</li>
      <li>Vue-Router for the routing</li>
      <li>VueUse for some good and usefull hooks</li>
    </ul>
  </div>
  <div class="mb-5">
    Example of how you can use Pinia as your store manager:
  </div>
  <div class="mb-2">
    Counter value is
    <span class="font-bold" :class="counterColor">{{ counter }}</span>
  </div>
  <div class="flex space-x-5">
    <button
      class="border border-red-500 rounded-md px-3 py-1"
      @click="decrease()"
    >
      Decrease Counter by 1
    </button>
    <button
      class="border border-green-500 rounded-md px-3 py-1"
      @click="increment()"
    >
      Increment Counter by 1
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const increment = () => globalStore.incrementCounter();
const decrease = () => globalStore.decreaseCounter();
const counter = $computed(() => globalStore.counter);
const counterColor = $computed(() =>
  counter > 0 ? `text-indigo-400` : `text-pink-300`
);
</script>
