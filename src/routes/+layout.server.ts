import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();

  if (!session?.user) {
    if (!session && event.url.pathname !== "/auth/signin") {
      throw redirect(303, "/auth/signin");
    }
  }

  const loggedIn = !!session?.user;

  return {
    loggedIn: loggedIn,
    user: session?.user,
  };
};
