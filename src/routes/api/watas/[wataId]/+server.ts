import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/apiUtils";

import { db } from "$lib/db";

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
      genreId,
      thumbnail,
      thumbnailCard,
      thumbnailBook,
      note,
      label,
      keywords,
      cautions,
      platforms,
    } = await request.json();

    const updateWata = await db.$transaction(async (tx) => {
      const updateWata = await tx.wata.update({
        where: {
          id: +wataId,
        },
        data: {
          title,
          creators,
          genreId,
          thumbnail,
          thumbnailCard,
          thumbnailBook,
          note,
          label,
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
        platforms
      );

      return updateWata;
    });

    return sendSuccessResponse(updateWata, 200);
  } catch (error) {
    console.error("Failed to update category data:", error);
    return sendErrorResponse("Failed to update category data", 500);
  }
};

async function updateMappings(
  mappingTable: any,
  mappingField: string,
  wataId: number,
  newItems: { id: number; url?: string }[]
) {
  const existingMappings = await mappingTable.findMany({
    where: { wataId },
    select: { [mappingField]: true },
  });

  const existingItemIds = existingMappings.map(
    (mapping: any) => mapping[mappingField]
  );

  const itemsToAdd = newItems.filter(({ id }) => !existingItemIds.includes(id));

  const itemsToRemove = existingItemIds.filter(
    (itemId: number) => !newItems?.map((ni) => ni.id)?.includes(itemId)
  );

  if (itemsToRemove.length > 0) {
    await mappingTable.deleteMany({
      where: {
        wataId,
        [mappingField]: {
          in: itemsToRemove,
        },
      },
    });
  }

  if (itemsToAdd.length > 0) {
    await mappingTable.createMany({
      data: itemsToAdd.map(({ id, url }) => ({
        wataId,
        [mappingField]: id,
        ...(url ? { url } : {}),
      })),
    });
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
