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

    const requestBody = await request.json();

    const created = await db.category.create({
      data: {
        ...requestBody,
        adderId: +userId,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create category data:", error);
    return sendErrorResponse("Failed to create category data", 500);
  }
};
