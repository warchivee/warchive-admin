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

    const { name, description, targetIds } = await request.json();

    const created = await db.$transaction(async (tx) => {
      const newKeyword = await tx.keyword.create({
        data: {
          name,
          description,
          adderId: +userId,
          updaterId: +userId,
        },
      });

      await Promise.all(
        targetIds.map(async (id: number) => {
          await tx.wataKeywordMapping.updateMany({
            where: {
              keywordId: id,
            },
            data: {
              keywordId: newKeyword.id,
              updaterId: +userId,
            },
          });

          await tx.$queryRaw`
            WITH DuplicatedKeywordMappings AS (
              SELECT
                id,
                ROW_NUMBER() OVER (PARTITION BY keyword_id, wata_id ORDER BY id) AS rn
              FROM wata_keyword
            )
            DELETE FROM wata_keyword
            WHERE id IN (
              SELECT id
              FROM DuplicatedKeywordMappings
              WHERE rn > 1
            );
          `;

          await tx.keyword.delete({
            where: {
              id,
            },
          });
        })
      );

      return newKeyword;
    });

    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to merge keyword data:", error);
    return sendErrorResponse("Failed to merge keyword data", 500);
  }
};
