import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user && event.url.pathname !== "/login") {
    return redirect(302, "/login");
  }

  return {
    user: event.locals.user,
  };
};
