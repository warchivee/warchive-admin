// docs: https://authjs.dev/reference/sveltekit

import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import CredentialsProvider from "@auth/core/providers/credentials";
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
      secret: import.meta.env.VITE_AUTH_SECRET,
      trustHost: true,
      theme: {
        colorScheme: "dark",
        logo: "https://www.womynarchive.com/images/logo/logo-text.png",
      },
      //login 페이지 직접 만들고 싶다면 https://authjs.dev/getting-started/authentication/credentials#signin-form 참고
      // pages : { signIn: '/login'} 속성 추가
      providers: [
        CredentialsProvider({
          name: "Warchive Admin",
          credentials: {
            username: {
              label: "계정",
              type: "text",
              placeholder: "계정을 입력하세요.",
            },
            password: { label: "비밀번호", type: "password" },
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
              callbackUrl: "/",
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
