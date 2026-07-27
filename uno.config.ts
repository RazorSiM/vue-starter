import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    // presetUno/presetWind are deprecated aliases of presetWind3. presetWind4 is the
    // Tailwind-v4-aligned engine and ships its own reset via preflights.reset
    // (default: true — set explicitly here to document that @unocss/reset is gone).
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      collections: {
        lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      // With @unocss/eslint-plugin gone, this is the only thing that catches a typo'd
      // icon name (e.g. i-lucide-moom) — it warns at build time instead of silently
      // rendering nothing.
      warn: true,
    }),
    presetTypography({
      // presetTypography mirrors Tailwind Typography, which wraps inline <code>
      // in literal backticks via ::before/::after. The markdown already reads as
      // code without them, so they just render as stray punctuation.
      cssExtend: {
        'code::before': { content: 'none' },
        'code::after': { content: 'none' },
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter',
        mono: 'Fira Code',
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
})
