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

    const { name, description, targetIds } = await request.json();

    const created = await db.$transaction(async (tx) => {
      const newCaution = await tx.caution.create({
        data: {
          name,
          description,
          adderId: +userId,
          updaterId: +userId,
        },
      });

      await Promise.all(
        targetIds.map(async (id: number) => {
          await tx.wataCautionMapping.updateMany({
            where: {
              cautionId: id,
            },
            data: {
              cautionId: newCaution.id,
              updaterId: +userId,
            },
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
              id,
            },
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
