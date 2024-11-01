const authenticate = async (locals) => {
  const session = await locals.auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized access");
  }
  return session.user.id;
};
const sendErrorResponse = (message, status) => new Response(message, { status });
const sendSuccessResponse = (data, status) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
});
export {
  authenticate as a,
  sendErrorResponse as b,
  sendSuccessResponse as s
};
