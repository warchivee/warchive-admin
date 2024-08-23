import type { RequestHandler } from "@sveltejs/kit";
import {
  authenticate,
  sendSuccessResponse,
  sendErrorResponse,
} from "$lib/apiUtils";
import { db } from "$lib/db";

export const POST: RequestHandler = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);

    const { categoryId } = params;

    if (!categoryId) {
      return sendErrorResponse("Invalid category Id", 404);
    }

    const requestBody = await request.json();

    const created = await db.platform.create({
      data: {
        ...requestBody,
        categoryId: +categoryId,
        adderId: +userId,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create platform data:", error);
    return sendErrorResponse("Failed to create platform data", 500);
  }
};
