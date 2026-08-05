import { errors } from "../../shared/error";

export const authMiddleware: Middleware = (
  req,
  next,
): Response | Promise<Response> => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(errors.unauthorized, {
      status: 401,
    });
  }

  const authToken = authHeader.slice(7);
  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret) {
    throw new Error("Переменной AUTH_SECRET не существует");
  }

  if (authToken !== authSecret) {
    return new Response(errors.unauthorized, {
      status: 401,
    });
  }

  return next();
};
