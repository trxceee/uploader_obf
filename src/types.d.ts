declare global {
  interface IRoute {
    path: string;
    method: HttpMethod;
    handler: (req: Request) => Response | Promise<Response>;
  }

  type Middleware = (
    req: Request,
    next: () => Response | Promise<Response>,
  ) => Response | Promise<Response>;

  type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "OPTIONS";
}

export {};