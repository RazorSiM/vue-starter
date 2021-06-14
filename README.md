# Vite Vue3 Typescript Starter

My Vite starter template for fast prototyping. If you want to try it:

`degit RazorSiM/vite-vue-ts-starter` alien

## Scaffolding

I've added an example on how you could use a multi layout approach for your project. There's also a "dark mode" toggler example using Tailwind features.

## Packages

- Windi CSS
- Vue Router because eventually you'll need it
- Vueuse because it's super usefull
- Code Style and Linters

I tried to configure everything to work with:

- `Eslint` for linting errors in TS/Vue
- `Stylelint` for styles
- `Prettier` for code formatting
- `LeftHook` and Husky for pre-commit linting. You can extend the hook to do wathever you want.

## VSCode Integration

Clone the repo and install the recommended packages. Check the .vscode folder to know more about the settings. By default, when saving it will run Prettier format, Eslint and Stylelint.

## How to run it

First of all, install the dependencies: `npm install` or `yarn`.
Run `npm run dev` or `yarn dev` to start hacking.

In your `./package.json` `Script` section there are some useful commands configured, so check it out.

TODO:

[ ] Add Vuex or Pinia as store manager
