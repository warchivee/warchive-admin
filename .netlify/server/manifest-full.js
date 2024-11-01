export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.B3VkC5mK.js","app":"_app/immutable/entry/app.BEoETCpx.js","imports":["_app/immutable/entry/start.B3VkC5mK.js","_app/immutable/chunks/entry.Ca3ymyJu.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CNo12yBk.js","_app/immutable/chunks/paths.ad-nS-rz.js","_app/immutable/entry/app.BEoETCpx.js","_app/immutable/chunks/scheduler.DSoV20YE.js","_app/immutable/chunks/index.CDXGZtfw.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/api/category",
				pattern: /^\/api\/category\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_server.ts.js'))
			},
			{
				id: "/api/category/[categoryId]",
				pattern: /^\/api\/category\/([^/]+?)\/?$/,
				params: [{"name":"categoryId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_categoryId_/_server.ts.js'))
			},
			{
				id: "/api/category/[categoryId]/genres",
				pattern: /^\/api\/category\/([^/]+?)\/genres\/?$/,
				params: [{"name":"categoryId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_categoryId_/genres/_server.ts.js'))
			},
			{
				id: "/api/category/[categoryId]/genres/[genreId]",
				pattern: /^\/api\/category\/([^/]+?)\/genres\/([^/]+?)\/?$/,
				params: [{"name":"categoryId","optional":false,"rest":false,"chained":false},{"name":"genreId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_categoryId_/genres/_genreId_/_server.ts.js'))
			},
			{
				id: "/api/category/[categoryId]/platforms",
				pattern: /^\/api\/category\/([^/]+?)\/platforms\/?$/,
				params: [{"name":"categoryId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_categoryId_/platforms/_server.ts.js'))
			},
			{
				id: "/api/category/[categoryId]/platforms/[platformId]",
				pattern: /^\/api\/category\/([^/]+?)\/platforms\/([^/]+?)\/?$/,
				params: [{"name":"categoryId","optional":false,"rest":false,"chained":false},{"name":"platformId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/category/_categoryId_/platforms/_platformId_/_server.ts.js'))
			},
			{
				id: "/api/cautions",
				pattern: /^\/api\/cautions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/cautions/_server.ts.js'))
			},
			{
				id: "/api/cautions/merge",
				pattern: /^\/api\/cautions\/merge\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/cautions/merge/_server.ts.js'))
			},
			{
				id: "/api/cautions/[cautionId]",
				pattern: /^\/api\/cautions\/([^/]+?)\/?$/,
				params: [{"name":"cautionId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/cautions/_cautionId_/_server.ts.js'))
			},
			{
				id: "/api/keywords",
				pattern: /^\/api\/keywords\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/keywords/_server.ts.js'))
			},
			{
				id: "/api/keywords/merge",
				pattern: /^\/api\/keywords\/merge\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/keywords/merge/_server.ts.js'))
			},
			{
				id: "/api/keywords/[keywordId]",
				pattern: /^\/api\/keywords\/([^/]+?)\/?$/,
				params: [{"name":"keywordId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/keywords/_keywordId_/_server.ts.js'))
			},
			{
				id: "/api/watas",
				pattern: /^\/api\/watas\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/watas/_server.ts.js'))
			},
			{
				id: "/api/watas/[wataId]",
				pattern: /^\/api\/watas\/([^/]+?)\/?$/,
				params: [{"name":"wataId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/watas/_wataId_/_server.ts.js'))
			},
			{
				id: "/category",
				pattern: /^\/category\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/data",
				pattern: /^\/data\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/keyword",
				pattern: /^\/keyword\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/platform",
				pattern: /^\/platform\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/publish",
				pattern: /^\/publish\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/signin",
				pattern: /^\/signin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
