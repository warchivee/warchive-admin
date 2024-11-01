import { d as db } from "../../../chunks/db.js";
async function load() {
  try {
    const keywords = await db.keyword.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    const cautions = await db.caution.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return {
      keywords,
      cautions
    };
  } catch (error) {
    console.error("Failed to load categories:", error);
    return {
      keywords: [],
      cautions: []
    };
  }
}
export {
  load
};
