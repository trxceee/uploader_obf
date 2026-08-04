declare global {
  interface IRoute {
    path: string;
    method: HttpMethod;
    handler: (req: Request) => Response | Promise<Response>;
  }

  type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "OPTIONS"
}

export {};