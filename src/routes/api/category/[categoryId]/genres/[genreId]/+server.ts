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

    const { categoryId, genreId } = params;

    if (!categoryId) {
      return sendErrorResponse("Invalid category Id", 404);
    }

    if (!genreId) {
      return sendErrorResponse("Invalid genre Id", 404);
    }

    const requestBody = await request.json();

    const updated = await db.genre.update({
      where: {
        id: +genreId,
        categoryId: +categoryId,
      },
      data: {
        ...requestBody,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update category data:", error);
    return sendErrorResponse("Failed to update category data", 500);
  }
};
