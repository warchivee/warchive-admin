import { redirect, type Handle } from "@sveltejs/kit";
import { handle as authenticationHandle } from "./auth";
import { sequence } from "@sveltejs/kit/hooks";

async function authorizationHandle({ event, resolve }: any) {
  if (event.url.pathname.startsWith("/api")) {
    const session = await event.locals.auth();

    if (!session) {
      throw redirect(302, "signin");
    }
  }

  return resolve(event);
}

export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle
);
