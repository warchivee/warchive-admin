// docs: https://authjs.dev/getting-started/authentication/credentials#signin-form

import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db } from "$lib/db";
// import { VITE_AUTH_SECRET } from "$env/static/private";

import type { RequestEvent } from "@sveltejs/kit";

const HOUR = 60 * 60;
const DAY = HOUR * 24;

export const { handle, signIn, signOut } = SvelteKitAuth(
  async (event: RequestEvent) => {
    const authOptions: SvelteKitAuthConfig = {
      session: {
        strategy: "jwt",
        maxAge: DAY * 2,
        updateAge: DAY * 1, //세션 2일 뒤 만료, 1일 내에 활동 시 갱신(갱신시점에서 2일 뒤 만료되는 새 토큰 발급)
      },
      cookies: {
        sessionToken: {
          name: "__Secure-authjs.session-token",
        },
      },
      secret: import.meta.env.VITE_AUTH_SECRET,
      trustHost: true,
      // useSecureCookies: false,
      pages: {
        signIn: "/signin",
      },
      providers: [
        Credentials({
          credentials: {
            username: {},
            password: {},
          },
          async authorize(credentials) {
            const user = await db.user.findUnique({
              where: { account: credentials.username as string },
            });

            if (!user) {
              return null;
            }

            if (user.password !== credentials.password) {
              return null;
            }

            return {
              id: user.id.toString(),
              name: user.nickname,
              redirect: true,
            };
          },
        }),
      ],
      callbacks: {
        session: async ({ session, token }) => {
          session.user.id = token.sub as string;
          session.user.name = token.name;

          return session;
        },
      },
    };

    return authOptions;
  }
);
