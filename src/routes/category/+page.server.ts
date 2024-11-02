import { db } from "$lib/server/db";

import { type Category, type Genre } from "@prisma/client";

type LoadData = {
  categories: (Category & { genres: Genre[] })[];
};

export async function load(): Promise<LoadData> {
  try {
    const categories = await db.category.findMany({
      include: {
        genres: true,
        platforms: true,
      },
    });

    return {
      categories,
    };
  } catch (error) {
    console.error("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
