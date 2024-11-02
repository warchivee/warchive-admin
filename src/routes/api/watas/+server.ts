import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/server/apiUtils";

import { db } from "$lib/server/db";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const userId = await authenticate(locals);

    const {
      title,
      creators,
      genre,
      thumbnail,
      thumbnailCard,
      thumbnailBook,
      note,
      label,
      keywords,
      cautions,
      platforms,
    } = await request.json();

    const newWata = await db.$transaction(async (tx) => {
      const newWata = await tx.wata.create({
        data: {
          title,
          creators,
          genre,
          thumbnail,
          thumbnailCard,
          thumbnailBook,
          note,
          label,
          adderId: +userId,
          updaterId: +userId,
        },
      });

      if (platforms && platforms.length > 0) {
        await tx.wataPlatformMapping.createMany({
          data: platforms.map((platformId: number) => ({
            wataId: newWata.id,
            platformId,
            adderId: +userId,
            updaterId: +userId,
          })),
        });
      }

      if (keywords && keywords.length > 0) {
        await tx.wataKeywordMapping.createMany({
          data: keywords.map((keywordId: number) => ({
            wataId: newWata.id,
            keywordId,
            adderId: +userId,
            updaterId: +userId,
          })),
        });
      }

      if (cautions && cautions.length > 0) {
        await tx.wataCautionMapping.createMany({
          data: cautions.map((cautionId: number) => ({
            wataId: newWata.id,
            cautionId,
            adderId: +userId,
            updaterId: +userId,
          })),
        });
      }

      return newWata;
    });

    const created = await db.wata.findUniqueOrThrow({
      where: { id: newWata.id },
      include: {
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
        updater: {
          select: {
            id: true,
            nickname: true,
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
      },
    });

    const formattedWata = {
      ...created,
      keywords: created.keywords.map((k) => k.keyword),
      cautions: created.cautions.map((c) => c.caution),
      platforms: created.platforms.map((p) => ({
        ...p.platform,
        url: p.url,
      })),
    };

    //id 가 bigint 형이라 아래처럼 처리해줘야 함.
    return new Response(
      JSON.stringify(formattedWata, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to create wata data:", error);
    return sendErrorResponse("Failed to create wata data", 500);
  }
};

export const GET: RequestHandler = async ({ url, locals }) => {
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const skip = (page - 1) * pageSize;
  const titleFilter = url.searchParams.get("title") || "";
  const creatorFilter = url.searchParams.get("creators") || "";

  const label = url.searchParams.get("label");
  const labelFilter = label ? label.split(",") : [];

  const category = url.searchParams.get("categories");
  const categoryFilter = category
    ? category
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id))
    : [];

  const genre = url.searchParams.get("genres");
  const genreFilter = genre
    ? genre
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id))
    : [];

  const keyword = url.searchParams.get("keywords");
  const keywordFilter = keyword
    ? keyword
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id))
    : [];

  const caution = url.searchParams.get("cautions");
  const cautionFilter = caution
    ? caution
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id))
    : [];

  const platform = url.searchParams.get("platforms");
  const platformFilter = platform
    ? platform
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id))
    : [];

  const startDateParam = url.searchParams.get("updateStartDate");
  const startDate = startDateParam ? new Date(startDateParam) : undefined;

  const endDateParam = url.searchParams.get("updateEndDate");
  const endDate = endDateParam ? new Date(endDateParam) : undefined;

  if (
    (startDate && isNaN(startDate.getDate())) ||
    (endDate && isNaN(endDate.getDate()))
  ) {
    return new Response("Invalid date format", { status: 400 });
  }

  const publishedParam = url.searchParams.get("isPublished") || "";
  const publishedFilter =
    publishedParam === "Y" ? true : publishedParam === "N" ? false : undefined;

  const emptyFilter =
    (url.searchParams.get("needWriteItems") || "").split(",") || [];

  const whereClause: any = {
    ...(titleFilter && {
      title: {
        contains: titleFilter,
        mode: "insensitive",
      },
    }),
    ...(creatorFilter && {
      creators: {
        contains: creatorFilter,
        mode: "insensitive",
      },
    }),
    ...(labelFilter &&
      labelFilter.length > 0 && {
        label: {
          in: labelFilter,
        },
      }),
    ...(categoryFilter &&
      categoryFilter.length > 0 && {
        genre: {
          categoryId: {
            in: categoryFilter,
          },
        },
      }),
    ...(genreFilter &&
      genreFilter.length > 0 && {
        genreId: {
          in: genreFilter,
        },
      }),
    ...(keywordFilter &&
      keywordFilter.length > 0 && {
        keywords: {
          some: {
            keywordId: {
              in: keywordFilter,
            },
          },
        },
      }),
    ...(cautionFilter &&
      cautionFilter.length > 0 && {
        cautions: {
          some: {
            cautionId: {
              in: cautionFilter,
            },
          },
        },
      }),
    ...(platformFilter &&
      platformFilter.length > 0 && {
        platforms: {
          some: {
            platformId: {
              in: platformFilter,
            },
          },
        },
      }),
    ...((startDate || endDate) && {
      updatedAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    }),
    ...(publishedFilter !== undefined && {
      isPublished: publishedFilter,
    }),
  };

  const emptyConditions: any[] = [];
  if (emptyFilter.includes("title")) emptyConditions.push({ title: null });
  if (emptyFilter.includes("creator")) emptyConditions.push({ creators: null });
  if (emptyFilter.includes("genre")) emptyConditions.push({ genre: null });
  if (emptyFilter.includes("thumbnail"))
    emptyConditions.push({ thumbnail: null });
  if (emptyFilter.includes("keywords")) {
    emptyConditions.push({
      keywords: {
        none: {},
      },
    });
  }
  if (emptyFilter.includes("platforms")) {
    emptyConditions.push({
      platforms: {
        none: {},
      },
    });
  }

  if (emptyConditions.length > 0) {
    whereClause.AND = [...(whereClause.AND || []), ...emptyConditions];
  }

  try {
    const totalCount = await db.wata.count({
      where: whereClause,
    });

    const watas = await db.wata.findMany({
      skip,
      take: pageSize,
      where: whereClause,
      include: {
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
        updater: {
          select: {
            id: true,
            nickname: true,
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
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "asc", // 처음에 밀어넣었던 데이터들의 생성 시간이 같아, id 순서로 정렬하는 옵션 추가
        },
      ],
    });
    const formattedWatas = watas.map((wata) => ({
      ...wata,
      keywords: wata.keywords.map((k) => k.keyword),
      cautions: wata.cautions.map((c) => c.caution),
      platforms: wata.platforms.map((p) => ({
        ...p.platform,
        url: p.url,
      })),
    }));

    //id 가 bigint 형이라 아래처럼 처리해줘야 함.
    return new Response(
      JSON.stringify(
        {
          watas: formattedWatas,
          totalCount,
        },
        (key, value) => (typeof value === "bigint" ? value.toString() : value)
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load wata data:", error);
    return sendErrorResponse("Failed to load wata data", 500);
  }
};
