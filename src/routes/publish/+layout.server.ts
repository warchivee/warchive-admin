import type { LayoutServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load = (async ({ parent }) => {
  const parentData = await parent();

  // if (!parentData.loggedIn) {
  //   throw redirect(303, "auth/signin");
  // }
}) satisfies LayoutServerLoad;
