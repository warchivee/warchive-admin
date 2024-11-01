import * as server from '../entries/pages/category/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/category/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/category/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.jyiu_a-8.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.BO3Zs_Vb.js","_app/immutable/chunks/input.NuWFDWq9.js","_app/immutable/chunks/index.CNo12yBk.js","_app/immutable/chunks/card-content.B-hGFXw7.js","_app/immutable/chunks/separator.CgmEbpDw.js","_app/immutable/chunks/chevron-right.CLC5T2IO.js","_app/immutable/chunks/axios.BANz41jA.js","_app/immutable/chunks/categories.store.DP7ivX3G.js","_app/immutable/chunks/pencil.3pbYXSRT.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.DQwrSZtH.css"];
export const fonts = [];
