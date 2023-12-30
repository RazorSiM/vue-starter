<template>
  <div class="flex gap-4">
    <router-link to="/" aria-label="Home Page" active-class="border-b-2 border-red-500">
      <div class="i-fluent-emoji:house h-10 w-10" />
    </router-link>
    <router-link to="/changelog" aria-label="Changelog Page" active-class="border-b-2 border-red-500">
      <div class="i-fluent-emoji:counterclockwise-arrows-button h-10 w-10" />
    </router-link>
    <router-link to="/about" aria-label="About Page" active-class="border-b-2 border-red-500">
      <div class="i-fluent-emoji:alien h-10 w-10" />
    </router-link>
  </div>
</template>
