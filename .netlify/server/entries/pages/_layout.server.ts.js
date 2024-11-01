import { r as redirect } from "../../chunks/index.js";
const load = async (event) => {
  const session = await event.locals.auth();
  if (!session?.user && event.url.pathname !== "/signin") {
    throw redirect(303, "signin");
  }
  const loggedIn = !!session?.user;
  return {
    loggedIn,
    user: session?.user
  };
};
export {
  load
};
