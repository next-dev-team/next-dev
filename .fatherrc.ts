import { defineConfig } from 'father'

export default defineConfig({
  esm: { output: 'dist' },

  prebundle: {
    // pre-bundle analytics for reduce install size
    // because @umijs/plugins depends on a lot of 3rd-party deps
    deps: [],
  },
})
