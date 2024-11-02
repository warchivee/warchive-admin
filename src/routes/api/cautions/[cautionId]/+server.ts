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

    const { cautionId } = params;

    if (!cautionId) {
      return sendErrorResponse("Invalid caution Id", 404);
    }

    const requestBody = await request.json();

    const updated = await db.caution.update({
      where: {
        id: +cautionId,
      },
      data: {
        ...requestBody,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update caution data:", error);
    return sendErrorResponse("Failed to update caution data", 500);
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    await authenticate(locals);

    const { cautionId } = params;

    if (!cautionId) {
      return sendErrorResponse("Invalid caution Id", 404);
    }

    const id = +cautionId;

    await db.$transaction(async (tx) => {
      await tx.wataCautionMapping.deleteMany({
        where: {
          cautionId: id,
        },
      });

      await tx.caution.delete({
        where: {
          id,
        },
      });
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Failed to delete caution data:", error);
    return sendErrorResponse("Failed to delete caution data", 500);
  }
};
