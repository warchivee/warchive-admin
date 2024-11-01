import { a as authenticate, s as sendSuccessResponse, b as sendErrorResponse } from "../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../chunks/db.js";
const POST = async ({ request, locals }) => {
  try {
    const userId = await authenticate(locals);
    const { name, description, targetIds } = await request.json();
    const created = await db.$transaction(async (tx) => {
      const newCaution = await tx.caution.create({
        data: {
          name,
          description,
          adderId: +userId,
          updaterId: +userId
        }
      });
      await Promise.all(
        targetIds.map(async (id) => {
          await tx.wataCautionMapping.updateMany({
            where: {
              cautionId: id
            },
            data: {
              cautionId: newCaution.id,
              updaterId: +userId
            }
          });
          await tx.$queryRaw`
            WITH DuplicatedCautionMappings AS (
              SELECT
                id,
                ROW_NUMBER() OVER (PARTITION BY caution_id, wata_id ORDER BY id) AS rn
              FROM wata_caution
            )
            DELETE FROM wata_caution
            WHERE id IN (
              SELECT id
              FROM DuplicatedCautionMappings
              WHERE rn > 1
            );
          `;
          await tx.caution.delete({
            where: {
              id
            }
          });
        })
      );
      return newCaution;
    });
    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to merge caution data:", error);
    return sendErrorResponse("Failed to merge caution data", 500);
  }
};
export {
  POST
};
