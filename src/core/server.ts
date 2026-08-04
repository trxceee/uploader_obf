import type { Router } from "./router";

export class Server {
  server?: Bun.Server<undefined>;

  constructor(private readonly router: Router) {}

  public run(port: number) {
    this.server = Bun.serve({
      port,
      fetch: (req) => this.router.handle(req),
    });
  }
}
