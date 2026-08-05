const ORIGIN_DOMAINS = [
  "https://peakclient.su",
  "https://arizonadlc.fun",
  "https://polyakdlc.tech",
  "https://dreamdlc.fun",
  "https://rainvisuals.pro",
];

export const corsMiddleware: Middleware = (req, next) => {
  const origin = req.headers.get("Origin");

  if (!origin || !ORIGIN_DOMAINS.includes(origin)) {
    return new Response("У вас нет доступа", {
      status: 403,
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  return next();
};
