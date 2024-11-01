import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();

  console.log(session?.user);

  if (!session?.user && event.url.pathname !== "/signin") {
    throw redirect(303, "signin");
  }

  const loggedIn = !!session?.user;

  return {
    loggedIn: loggedIn,
    user: session?.user,
  };
};
