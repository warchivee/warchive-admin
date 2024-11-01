import { a as authenticate, b as sendErrorResponse, s as sendSuccessResponse } from "../../../../../../../chunks/apiUtils.js";
import { d as db } from "../../../../../../../chunks/db.js";
const PATCH = async ({ params, request, locals }) => {
  try {
    const userId = await authenticate(locals);
    const { categoryId, platformId } = params;
    if (!categoryId) {
      return sendErrorResponse("Invalid Category Id", 404);
    }
    if (!platformId) {
      return sendErrorResponse("Invalid Platform Id", 404);
    }
    const requestBody = await request.json();
    const updated = await db.platform.update({
      where: {
        id: +platformId
      },
      data: {
        ...requestBody,
        updaterId: +userId
      }
    });
    return sendSuccessResponse(updated, 200);
  } catch (error) {
    console.error("Failed to update platform data:", error);
    return sendErrorResponse("Failed to update platform data", 500);
  }
};
const DELETE = async ({ params, locals }) => {
  try {
    await authenticate(locals);
    const { categoryId, platformId } = params;
    if (!categoryId) {
      return sendErrorResponse("Invalid Category Id", 404);
    }
    if (!platformId) {
      return sendErrorResponse("Invalid Platform Id", 404);
    }
    const id = +platformId;
    await db.$transaction(async (tx) => {
      await tx.wataPlatformMapping.deleteMany({
        where: {
          platformId: id
        }
      });
      await tx.platform.delete({
        where: {
          id
        }
      });
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Failed to delete platform data:", error);
    return sendErrorResponse("Failed to delete platform data", 500);
  }
};
export {
  DELETE,
  PATCH
};
