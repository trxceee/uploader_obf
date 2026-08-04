import { Router } from "./core/router";
import { Server } from "./core/server";

async function main() {
  const router = new Router();
  const server = new Server(router);

  const port = Number(process.env.PORT) ?? 5000;
  server.run(port);
}

await main();
