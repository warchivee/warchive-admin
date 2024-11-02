import { db } from "$lib/server/db";

import { type Keyword, type Caution } from "@prisma/client";

type LoadData = {
  keywords: Keyword[];
  cautions: Caution[];
};

export async function load(): Promise<LoadData> {
  try {
    const keywords = await db.keyword.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const cautions = await db.caution.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      keywords,
      cautions,
    };
  } catch (error) {
    console.error("Failed to load categories:", error);
    return {
      keywords: [],
      cautions: [],
    };
  }
}
