import type { RequestHandler } from "@sveltejs/kit";
import { authenticate, sendErrorResponse } from "$lib/server/apiUtils";

import { db } from "$lib/server/db";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const userId = await authenticate(locals);

    const { lastUpdatedAt, titles } = await request.json();

    const createdWatas = await findCreateWatas(titles);
    const updatedWatas = await findUpdateWatas(lastUpdatedAt, titles);
    const deletedWatas = await findDeleteWatas();

    await db.$transaction(async (tx) => {
      // 게시된 데이터 내리기
      await tx.publishWata.deleteMany({
        where: {
          id: { in: deletedWatas?.map((d) => d.id) },
        },
      });

      await tx.wata.updateMany({
        where: {
          id: { in: deletedWatas?.map((d) => d.id) },
        },
        data: {
          isPublished: false,
        },
      });

      // 게시한 데이터 수정하기기
      updatedWatas?.forEach(async (item) => {
        await tx.publishWata.update({
          where: {
            id: item.id,
          },
          data: {
            ...item,
            thumbnailCard: item.thumbnailCard ?? {},
            thumbnailBook: item.thumbnailBook ?? {},
            category: item.genre?.category,
            genre: { id: item.genre?.id, name: item.genre?.name },
          },
        });
      });

      // 게시하기기
      createdWatas?.forEach(async (item) => {
        await tx.publishWata.create({
          data: {
            ...item,
            thumbnailCard: item.thumbnailCard ?? {},
            thumbnailBook: item.thumbnailBook ?? {},
            category: item.genre?.category,
            genre: { id: item.genre?.id, name: item.genre?.name },
          },
        });
      });

      await tx.wata.updateMany({
        where: {
          id: { in: createdWatas?.map((c) => c.id) },
        },
        data: {
          isPublished: true,
        },
      });
    });

    const result = {
      new_watas: createdWatas?.map((w) => w.title),
      update_watas: updatedWatas?.map((w) => w.title),
      delete_watas: deletedWatas?.map((w) => w.title),
    };

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to create wata data:", error);
    return sendErrorResponse("Failed to create wata data", 500);
  }
};

const wataIncludes = {
  genre: {
    select: {
      id: true,
      name: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  keywords: {
    select: {
      keyword: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  cautions: {
    select: {
      caution: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  platforms: {
    select: {
      platform: {
        select: {
          id: true,
          name: true,
        },
      },
      url: true,
    },
  },
};

const findUpdateWatas = async (lastUpdatedAt: Date, titles?: string[]) => {
  try {
    const updateWatas = await db.wata.findMany({
      include: wataIncludes,
      where: {
        label: "CHECKED",
        isPublished: true,
        updatedAt: {
          gt: lastUpdatedAt,
        },
        AND: [{ thumbnail: { not: null } }, { thumbnail: { not: "" } }],
        genreId: { not: null },
        keywords: { some: {} },
        OR: [
          {
            platforms: { some: {} },
          },
          {
            noPlatform: true,
          },
        ],
        ...getTitleFilter(titles),
      },
    });

    return updateWatas;
  } catch (error) {
    console.error("Error fetching Wata records: ", error);
    throw new Error("Failed to fetch Wata records to update");
  }
};

const findCreateWatas = async (titles?: string[]) => {
  try {
    const createWatas = await db.wata.findMany({
      include: wataIncludes,
      where: {
        label: "CHECKED",
        isPublished: false,
        AND: [{ thumbnail: { not: null } }, { thumbnail: { not: "" } }],
        genreId: { not: null },
        keywords: { some: {} },
        OR: [
          {
            platforms: { some: {} },
          },
          {
            noPlatform: true,
          },
        ],
        ...getTitleFilter(titles),
      },
    });

    return createWatas;
  } catch (error) {
    console.error("Error fetching Wata records: ", error);
    throw new Error("Failed to fetch Wata records to update");
  }
};

const findDeleteWatas = async () => {
  const deletedWata = await db.wata.findMany({
    select: {
      id: true,
      title: true,
    },
    where: {
      label: { not: "CHECKED" },
      isPublished: true,
    },
  });

  return deletedWata;
};

const getTitleFilter = (titles?: string[]) => {
  const isTitleFilter = titles && Array.isArray(titles) && titles.length > 0;

  return isTitleFilter
    ? {
        title: { in: titles },
      }
    : null;
};
