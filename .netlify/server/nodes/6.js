import * as universal from '../entries/pages/data/_page.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/data/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/data/+page.ts";
export const imports = ["_app/immutable/nodes/6.bMOmbpve.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js","_app/immutable/chunks/Toaster.svelte_svelte_type_style_lang.BO3Zs_Vb.js","_app/immutable/chunks/input.NuWFDWq9.js","_app/immutable/chunks/index.CNo12yBk.js","_app/immutable/chunks/chevron-right.CLC5T2IO.js","_app/immutable/chunks/DataCard.BbAmSuGr.js","_app/immutable/chunks/index.DT0NLVLx.js","_app/immutable/chunks/axios.BANz41jA.js","_app/immutable/chunks/label.30i26_72.js","_app/immutable/chunks/index.Da2vhWsj.js","_app/immutable/chunks/KeywordSelect.XHrX4QUR.js","_app/immutable/chunks/switch.ChDVghSH.js","_app/immutable/chunks/categories.store.DP7ivX3G.js","_app/immutable/chunks/cautions.store.BtDxqCBn.js"];
export const stylesheets = ["_app/immutable/assets/Toaster.DQwrSZtH.css","_app/immutable/assets/DataCard.vFRcZGyv.css"];
export const fonts = [];
