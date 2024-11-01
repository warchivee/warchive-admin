import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    //https://kit.svelte.dev/docs/adapter-netlify
    adapter: adapter({
      edge: false,
      split: false,
    }),
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};

export default config;
