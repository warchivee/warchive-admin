import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/server/apiUtils";
import { db } from "$lib/server/db";

export const POST: RequestHandler = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);

    const { categoryId } = params;

    if (!categoryId) {
      return sendErrorResponse("Invalid category Id", 404);
    }

    const requestBody = await request.json();

    const created = await db.genre.create({
      data: {
        ...requestBody,
        categoryId: +categoryId,
        adderId: +userId,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create genre data:", error);
    return sendErrorResponse("Failed to create genre data", 500);
  }
};
