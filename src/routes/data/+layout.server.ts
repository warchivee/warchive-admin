import { db } from "$lib/server/db";

import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  try {
    const categories = await db.category.findMany({
      include: {
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
        platforms: {
          select: {
            id: true,
            name: true,
            domain: true,
            orderTop: true,
          },
        },
      },
    });

    const keywords = await db.keyword.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const cautions = await db.caution.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const sortedCategories = categories.map((category) => ({
      ...category,
      platforms: category.platforms.sort((a, b) => {
        if (a.orderTop === b.orderTop) {
          return 0;
        }
        return a.orderTop ? -1 : 1;
      }),
    }));

    return {
      categories: sortedCategories,
      keywords,
      cautions,
    };
  } catch (error) {
    console.error("Failed to load categories:", error);
    return {
      categories: [],
      keywords: [],
      cautions: [],
    };
  }
}) satisfies LayoutServerLoad;
