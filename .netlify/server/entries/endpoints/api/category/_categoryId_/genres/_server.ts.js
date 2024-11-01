import { a as authenticate, b as sendErrorResponse, s as sendSuccessResponse } from "../../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../../chunks/db.js";
const POST = async ({ params, request, locals }) => {
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
        updaterId: +userId
      }
    });
    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create genre data:", error);
    return sendErrorResponse("Failed to create genre data", 500);
  }
};
export {
  POST
};
