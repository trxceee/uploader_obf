import { authMiddleware, corsMiddleware } from "./core/middlewares";
import { Router } from "./core/router";
import { Server } from "./core/server";
import { ObfuscationTransport } from "./modules/obfuscation";
import { getEnv } from "./shared/utils";

async function main() {
  const router = new Router();
  const server = new Server(router);

  const obfuscationRoutes = new ObfuscationTransport().getRoutes();
  obfuscationRoutes.forEach((route) => {
    router.add(route);
  });

  server.use(authMiddleware);
  // server.use(corsMiddleware);

  const port = Number(getEnv("PORT")) ?? 5000;
  server.run(port);
}

await main();
