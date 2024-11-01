import * as server from '../entries/pages/data/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/data/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/data/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.nRRQBXTP.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js","_app/immutable/chunks/categories.store.DP7ivX3G.js","_app/immutable/chunks/index.CNo12yBk.js","_app/immutable/chunks/cautions.store.BtDxqCBn.js"];
export const stylesheets = [];
export const fonts = [];
