import { redirect, type Handle } from "@sveltejs/kit";
import { handle as authenticationHandle } from "./auth";
import { sequence } from "@sveltejs/kit/hooks";

async function authorizationHandle({ event, resolve }: any) {
  if (event.url.pathname.startsWith("/api")) {
    const session = await event.locals.auth();
    if (!session && event.url.pathname !== "/auth/signin") {
      throw redirect(302, "auth/signin");
    }
  }

  return resolve(event);
}

export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle
);
