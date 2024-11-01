import * as universal from '../entries/pages/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/4.DFyAm0Xb.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js"];
export const stylesheets = [];
export const fonts = [];
