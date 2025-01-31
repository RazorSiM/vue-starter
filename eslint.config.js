import antfu from '@antfu/eslint-config'
import playwright from 'eslint-plugin-playwright'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
}, {
  ...playwright.configs['flat/recommended'],
  files: ['e2e/**'],
  rules: {
    ...playwright.configs['flat/recommended'].rules,
  },
})
