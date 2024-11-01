import type { LayoutServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load = (async ({ parent }) => {
  const parentData = await parent();

  if (!parentData.loggedIn) {
    throw redirect(303, "auth/signin"); // /auth/signin 으로 하면 에러남
  }
}) satisfies LayoutServerLoad;
