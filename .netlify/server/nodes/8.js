import * as server from '../entries/pages/platform/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/platform/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/platform/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DaLDXCoZ.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.BO3Zs_Vb.js","_app/immutable/chunks/input.NuWFDWq9.js","_app/immutable/chunks/index.CNo12yBk.js","_app/immutable/chunks/card-content.B-hGFXw7.js","_app/immutable/chunks/index.BUrCY3y0.js","_app/immutable/chunks/index.Da2vhWsj.js","_app/immutable/chunks/index.DT0NLVLx.js","_app/immutable/chunks/axios.BANz41jA.js","_app/immutable/chunks/label.30i26_72.js","_app/immutable/chunks/switch.ChDVghSH.js","_app/immutable/chunks/categories.store.DP7ivX3G.js","_app/immutable/chunks/pencil.3pbYXSRT.js","_app/immutable/chunks/trash-2.BCbpVXIl.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.DQwrSZtH.css"];
export const fonts = [];
