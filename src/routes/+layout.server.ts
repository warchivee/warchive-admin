import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  if (event.url.pathname !== "/login" && !event.locals.user) {
    return redirect(302, "/login");
  }

  return {
    user: event.locals.user,
  };
};
