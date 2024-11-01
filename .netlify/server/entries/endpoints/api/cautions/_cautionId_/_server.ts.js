import { a as authenticate, b as sendErrorResponse, s as sendSuccessResponse } from "../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../chunks/db.js";
const PATCH = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);
    const { cautionId } = params;
    if (!cautionId) {
      return sendErrorResponse("Invalid caution Id", 404);
    }
    const requestBody = await request.json();
    const updated = await db.caution.update({
      where: {
        id: +cautionId
      },
      data: {
        ...requestBody,
        updaterId: +userId
      }
    });
    return sendSuccessResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update caution data:", error);
    return sendErrorResponse("Failed to update caution data", 500);
  }
};
const DELETE = async ({ params, locals }) => {
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
          cautionId: id
        }
      });
      await tx.caution.delete({
        where: {
          id
        }
      });
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Failed to delete caution data:", error);
    return sendErrorResponse("Failed to delete caution data", 500);
  }
};
export {
  DELETE,
  PATCH
};
