import { a as authenticate, b as sendErrorResponse, s as sendSuccessResponse } from "../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../chunks/db.js";
const PATCH = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);
    const { keywordId } = params;
    if (!keywordId) {
      return sendErrorResponse("Invalid Keyword Id", 404);
    }
    const requestBody = await request.json();
    const updated = await db.keyword.update({
      where: {
        id: +keywordId
      },
      data: {
        ...requestBody,
        updaterId: +userId
      }
    });
    return sendSuccessResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update keyword data:", error);
    return sendErrorResponse("Failed to update keyword data", 500);
  }
};
const DELETE = async ({ params, locals }) => {
  try {
    await authenticate(locals);
    const { keywordId } = params;
    if (!keywordId) {
      return sendErrorResponse("Invalid Keyword Id", 404);
    }
    const id = +keywordId;
    await db.$transaction(async (tx) => {
      await tx.wataKeywordMapping.deleteMany({
        where: {
          keywordId: id
        }
      });
      await tx.keyword.delete({
        where: {
          id
        }
      });
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Failed to delete keyword data:", error);
    return sendErrorResponse("Failed to delete keyword data", 500);
  }
};
export {
  DELETE,
  PATCH
};
