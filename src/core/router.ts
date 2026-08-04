import { errors } from "../shared/error";

export class Router {
  public routes: IRoute[] = [];

  public add(route: IRoute) {
    this.routes.push(route);
  }

  //   Абстракции для создания маршрута

  public get(route: Omit<IRoute, "method">) {
    this.add({ method: "GET", ...route });
  }

  public post(route: Omit<IRoute, "method">) {
    this.add({ method: "POST", ...route });
  }

  public put(route: Omit<IRoute, "method">) {
    this.add({ method: "PUT", ...route });
  }

  public patch(route: Omit<IRoute, "method">) {
    this.add({ method: "PATCH", ...route });
  }

  public delete(route: Omit<IRoute, "method">) {
    this.add({ method: "DELETE", ...route });
  }

  //   Выполнение хенлдера

  public handle(req: Request) {
    const url = new URL(req.url);
    const route = this.routes.find(
      (route) => route.path === url.pathname && route.method === req.method,
    );

    if (!route) return this.notFoundRoute();

    return route.handler(req);
  }

  private notFoundRoute = () =>
    new Response(errors.notFoundRoute, {
      status: 404,
    });
}
