import type { Router } from "./router";

export class Server {
  server?: Bun.Server<undefined>;
  middlewares: Middleware[] = [];

  constructor(private readonly router: Router) {}

  public use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  public run(port: number) {
    this.server = Bun.serve({
      port,
      fetch: (req) => this.chainMiddlewares(req),
    });
  }

  private chainMiddlewares(req: Request) {
    let index = 0;
    const next = () => {
      const middleware = this.middlewares[index++];
      if (!middleware) return this.router.handle(req);
      return middleware(req, next);
    };
    return next();
  }
}
