import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/server/apiUtils";

import { db } from "$lib/server/db";

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);

    const { wataId } = params;

    if (!wataId) {
      return sendErrorResponse("Invalid Wata Id", 404);
    }

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
      noPlatform
    } = await request.json();

    const updateWata = await db.$transaction(async (tx) => {
      const updateWata = await tx.wata.update({
        where: {
          id: +wataId,
        },
        data: {
          title,
          creators,
          genreId: genre.id,
          thumbnail,
          thumbnailCard,
          thumbnailBook,
          note,
          label,
          noPlatform,
          updaterId: +userId,
        },
      });

      await updateMappings(
        tx.wataKeywordMapping,
        "keywordId",
        +wataId,
        keywords
      );

      await updateMappings(
        tx.wataCautionMapping,
        "cautionId",
        +wataId,
        cautions
      );

      await updateMappings(
        tx.wataPlatformMapping,
        "platformId",
        +wataId,
        platforms,
        true
      );

      return updateWata;
    });

    const updated = await db.wata.findUniqueOrThrow({
      where: { id: updateWata.id },
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
      ...updated,
      keywords: updated.keywords.map((k) => k.keyword),
      cautions: updated.cautions.map((c) => c.caution),
      platforms: updated.platforms.map((p) => ({
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
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update data:", error);
    return sendErrorResponse("Failed to update data", 500);
  }
};

async function updateMappings(
  mappingTable: any,
  mappingField: string,
  wataId: number,
  newItems: { id: number; url?: string }[],
  enabledUpdate?: boolean
) {
  const existingMappings = await mappingTable.findMany({
    where: { wataId },
    select: { [mappingField]: true },
  });

  const existingItemIds = existingMappings.map(
    (mapping: any) => mapping[mappingField]
  );
  const newItemIds = newItems?.map((ni) => ni.id);

  const transactionOperations = [];

  const itemsToRemove = existingItemIds.filter(
    (itemId: number) => !newItemIds?.includes(itemId)
  );
  if (itemsToRemove.length > 0) {
    transactionOperations.push(
      mappingTable.deleteMany({
        where: {
          wataId,
          [mappingField]: { in: itemsToRemove },
        },
      })
    );
  }

  
  const itemsToAdd = newItems.filter(({ id }) => !existingItemIds.includes(id));
  if (itemsToAdd.length > 0) {
    transactionOperations.push(
      mappingTable.createMany({
        data: itemsToAdd.map(({ id, url }) => ({
          wataId,
          [mappingField]: id,
          ...(url ? { url } : {}),
        })),
      })
    );
  }

  if(enabledUpdate) {
    const itemsToUpdate = newItems.filter(({ id }) => existingItemIds.includes(id));
    if (itemsToUpdate.length > 0) {
      transactionOperations.push(
        ...itemsToUpdate.map(({ id, url }) =>
          mappingTable.update({
            where: {
              [`wataId_${mappingField}`] : {
                wataId,
                [mappingField]: id,
              }
            },
            data: {
              [mappingField]: id,
              ...(url ? { url } : {}),
            },
          })
        )
      );
    }
  }
  

  if (transactionOperations.length > 0) {
    await Promise.all(transactionOperations); 
  }
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const userId = await authenticate(locals);

    const { wataId } = params;

    if (!wataId) {
      return sendErrorResponse("Fail to find Wata Id", 404);
    }

    //todo: isPublished 가 true 면 삭제 X (게시된 데이터는 삭제 X)

    const deleteWata = await db.$transaction(async (tx) => {
      await tx.wataKeywordMapping.deleteMany({
        where: {
          wataId: +wataId,
        },
      });

      await tx.wataCautionMapping.deleteMany({
        where: {
          wataId: +wataId,
        },
      });

      await tx.wataPlatformMapping.deleteMany({
        where: {
          wataId: +wataId,
        },
      });

      const deleteWata = await tx.wata.delete({
        where: {
          id: +wataId,
        },
      });

      return deleteWata;
    });

    return sendSuccessResponse(deleteWata, 200);
  } catch (error) {
    console.error("Failed to delete wata:", error);
    return sendErrorResponse("Failed to delete wata", 500);
  }
};
