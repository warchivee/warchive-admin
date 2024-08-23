import {
  redirect,
  type Handle,
  type MaybePromise,
  type RequestEvent,
} from "@sveltejs/kit";
import { handle as authenticationHandle } from "./auth";
import { sequence } from "@sveltejs/kit/hooks";

interface HandleParams {
  event: RequestEvent;
  resolve: (event: RequestEvent) => MaybePromise<Response>;
}

async function authorizationHandle({ event, resolve }: HandleParams) {
  if (event.url.pathname.startsWith("/api")) {
    const session = await event.locals.auth();
    if (!session) {
      throw redirect(401, "auth/signin");
    }
  }

  return resolve(event);
}

export const handle: Handle = sequence(
  authenticationHandle,
  authorizationHandle
);
