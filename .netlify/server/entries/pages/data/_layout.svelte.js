import { c as create_ssr_component } from "../../../chunks/ssr.js";
import { c as categories } from "../../../chunks/categories.store.js";
import { k as keywords, c as cautions } from "../../../chunks/cautions.store.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  categories.set(data.categories);
  keywords.set(data.keywords);
  cautions.set(data.cautions);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
