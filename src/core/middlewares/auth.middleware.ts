import { errors } from "../../shared/error";
import { getEnv } from "../../shared/utils";

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
  const authSecret = getEnv("AUTH_SECRET");
  console.log(authToken, authSecret);

  if (authToken !== authSecret) {
    return new Response(errors.unauthorized, {
      status: 401,
    });
  }

  return next();
};
