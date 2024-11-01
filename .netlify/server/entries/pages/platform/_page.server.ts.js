import { d as db } from "../../../chunks/db.js";
async function load() {
  try {
    const categories = await db.category.findMany({
      include: {
        genres: true,
        platforms: true
      }
    });
    return {
      categories
    };
  } catch (error) {
    console.error("Failed to load categories:", error);
    return {
      categories: []
    };
  }
}
export {
  load
};
