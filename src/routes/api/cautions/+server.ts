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

    const requestBody = await request.json();

    const created = await db.caution.create({
      data: {
        ...requestBody,
        adderId: +userId,
        updaterId: +userId,
      },
    });

    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create caution data:", error);
    return sendErrorResponse("Failed to create caution data", 500);
  }
};
