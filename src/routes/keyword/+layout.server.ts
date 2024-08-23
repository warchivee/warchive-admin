import type { LayoutServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load = (async ({ parent }) => {
  const parentData = await parent();
}) satisfies LayoutServerLoad;
