export const authenticate = async (locals: App.Locals) => {
  if (!locals.user?.id) {
    throw new Error("Unauthorized access");
  }

  return locals.user.id;
};

export const sendErrorResponse = (message: string, status: number) =>
  new Response(message, { status });

export const sendSuccessResponse = (data: any, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
