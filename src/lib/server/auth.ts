import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { db } from "./db";

export const lucia = new Lucia(new PrismaAdapter(db.session, db.user), {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      account: attributes.account,
      name: attributes.nickname,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: number;
      account: string;
      nickname: string;
    };
  }
}
