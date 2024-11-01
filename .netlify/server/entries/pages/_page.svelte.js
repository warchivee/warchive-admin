import { c as create_ssr_component } from "../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-n3ior8_START -->${$$result.title = `<title>Home</title>`, ""}<!-- HEAD_svelte-n3ior8_END -->`, ""} <section data-svelte-h="svelte-j6l999"><h1>SvelteKit auth with JWT</h1></section>`;
});
export {
  Page as default
};
