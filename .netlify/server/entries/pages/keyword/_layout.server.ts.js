import "../../../chunks/index.js";
const load = async ({ parent }) => {
  await parent();
};
export {
  load
};
