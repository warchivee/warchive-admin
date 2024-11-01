import * as server from '../entries/pages/keyword/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/keyword/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.e6MZk3Jg.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js"];
export const stylesheets = [];
export const fonts = [];
