import { sveltekit } from "@sveltejs/kit/vite";
import mkcert from "vite-plugin-mkcert";

import { defineConfig } from "vite";

import { readFileSync } from "fs";

function getHttpsOptions() {
  return process.env.NODE_ENV === "ssl" // .ssl.env 파일 필요
    ? {
        key: readFileSync("./key.pem"),
        cert: readFileSync("./cert.pem"),
      }
    : undefined;
}

export default defineConfig({
  plugins: [sveltekit(), mkcert()],
  server: {
    https: getHttpsOptions(),
  },
});
