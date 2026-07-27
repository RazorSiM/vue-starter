<template>
  <!--
    Deliberately bare: page background and content padding, nothing else.
    No header and no navigation — that absence is the point, and it is what the
    /about layout switcher demonstrates. Pages using this layout are responsible
    for their own way back.
  -->
  <div
    class="min-h-screen bg-gray-50 text-gray-900 font-sans transition-colors dark:(bg-gray-950 text-gray-100)"
  >
    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
