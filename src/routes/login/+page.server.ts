import { db } from "$lib/server/db";
import { lucia } from "$lib/server/auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const { account, password } = Object.fromEntries(
      await request.formData()
    ) as Record<string, string>;

    const user = await db.user.findUnique({
      where: {
        account,
      },
    });

    if (!user || !user?.account) {
      return fail(400, { message: "Incorrect account" });
    }

    const validPassword = password === user.password;

    if (!validPassword) {
      return fail(400, { message: "Incorrect password" });
    }

    const session = await lucia.createSession(user.account, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    redirect(302, "/");
  },
};
