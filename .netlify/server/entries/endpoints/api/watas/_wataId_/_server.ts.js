import { a as authenticate, b as sendErrorResponse, s as sendSuccessResponse } from "../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../chunks/db.js";
const PATCH = async ({ params, request, locals }) => {
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
      platforms
    } = await request.json();
    const updateWata = await db.$transaction(async (tx) => {
      const updateWata2 = await tx.wata.update({
        where: {
          id: +wataId
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
          updaterId: +userId
        }
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
      return updateWata2;
    });
    return sendSuccessResponse(updateWata, 200);
  } catch (error) {
    console.error("Failed to update data:", error);
    return sendErrorResponse("Failed to update data", 500);
  }
};
async function updateMappings(mappingTable, mappingField, wataId, newItems) {
  const existingMappings = await mappingTable.findMany({
    where: { wataId },
    select: { [mappingField]: true }
  });
  const existingItemIds = existingMappings.map(
    (mapping) => mapping[mappingField]
  );
  const itemsToAdd = newItems.filter(({ id }) => !existingItemIds.includes(id));
  const itemsToRemove = existingItemIds.filter(
    (itemId) => !newItems?.map((ni) => ni.id)?.includes(itemId)
  );
  if (itemsToRemove.length > 0) {
    await mappingTable.deleteMany({
      where: {
        wataId,
        [mappingField]: {
          in: itemsToRemove
        }
      }
    });
  }
  if (itemsToAdd.length > 0) {
    await mappingTable.createMany({
      data: itemsToAdd.map(({ id, url }) => ({
        wataId,
        [mappingField]: id,
        ...url ? { url } : {}
      }))
    });
  }
}
const DELETE = async ({ params, locals }) => {
  try {
    const userId = await authenticate(locals);
    const { wataId } = params;
    if (!wataId) {
      return sendErrorResponse("Fail to find Wata Id", 404);
    }
    const deleteWata = await db.$transaction(async (tx) => {
      await tx.wataKeywordMapping.deleteMany({
        where: {
          wataId: +wataId
        }
      });
      await tx.wataCautionMapping.deleteMany({
        where: {
          wataId: +wataId
        }
      });
      await tx.wataPlatformMapping.deleteMany({
        where: {
          wataId: +wataId
        }
      });
      const deleteWata2 = await tx.wata.delete({
        where: {
          id: +wataId
        }
      });
      return deleteWata2;
    });
    return sendSuccessResponse(deleteWata, 200);
  } catch (error) {
    console.error("Failed to delete wata:", error);
    return sendErrorResponse("Failed to delete wata", 500);
  }
};
export {
  DELETE,
  PATCH
};
