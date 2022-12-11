/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    '@antfu',
    './.eslintrc-auto-import.json',
  ],
  globals: { defineOptions: 'writable' },
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      ],
      extends: [
        'plugin:cypress/recommended',
      ],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
