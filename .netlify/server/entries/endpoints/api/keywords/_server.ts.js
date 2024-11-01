import { a as authenticate, s as sendSuccessResponse, b as sendErrorResponse } from "../../../../chunks/apiUtils.js";
import { d as db } from "../../../../chunks/db.js";
const POST = async ({ request, locals }) => {
  try {
    const userId = await authenticate(locals);
    const requestBody = await request.json();
    const created = await db.keyword.create({
      data: {
        ...requestBody,
        adderId: +userId,
        updaterId: +userId
      }
    });
    return sendSuccessResponse(created, 201);
  } catch (error) {
    console.error("Failed to create keyword data:", error);
    return sendErrorResponse("Failed to create keyword data", 500);
  }
};
export {
  POST
};
