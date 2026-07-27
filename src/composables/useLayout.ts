import type { RouteMeta } from 'vue-router'

export type LayoutName = NonNullable<RouteMeta['layout']>

export const LAYOUTS: { name: LayoutName; summary: string; provides: string[] }[] = [
  {
    name: 'DefaultLayout',
    summary: 'App chrome: sticky header, navigation, theme toggle, centred content column.',
    provides: ['Header + nav', 'Theme toggle', 'Max-width column'],
  },
  {
    name: 'EmptyLayout',
    summary: 'Bare frame. Page background and spacing only — no header, no navigation.',
    provides: ['Page background', 'Content padding'],
  },
]

// Module-level so the whole app shares one override. Safe here because this is a
// client-only SPA; under SSR this would leak between requests and would need to
// live on the app instance instead.
const override = shallowRef<LayoutName | null>(null)

/**
 * Resolves which layout renders the current page.
 *
 * Normally that is whatever the page declared via `definePage({ meta: { layout } })`.
 * `setLayout()` temporarily overrides it, which is what the /about demo uses to let
 * you watch the chrome appear and disappear.
 */
export function useLayout() {
  const route = useRoute()

  const declared = computed<LayoutName>(() => route.meta.layout ?? 'DefaultLayout')
  const active = computed<LayoutName>(() => override.value ?? declared.value)

  function setLayout(name: LayoutName | null) {
    override.value = name
  }

  // `layouts` is returned rather than read from the LAYOUTS export directly, because
  // auto-imported *values* only referenced inside a <template> never become setup
  // bindings — Vue would compile them to `_ctx.LAYOUTS` and fail. Returning it here
  // makes it a real binding.
  return { active, declared, override, setLayout, layouts: LAYOUTS }
}
