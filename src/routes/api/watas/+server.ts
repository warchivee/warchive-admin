import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/apiUtils";

import { db } from "$lib/db";

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

    return sendSuccessResponse(newWata, 201);
  } catch (error) {
    console.error("Failed to create wata data:", error);
    return sendErrorResponse("Failed to create wata data", 500);
  }
};

export const GET: RequestHandler = async ({ url, locals }) => {
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const skip = (page - 1) * pageSize;

  try {
    const totalCount = await db.wata.count();

    const watas = await db.wata.findMany({
      skip,
      take: pageSize,
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
