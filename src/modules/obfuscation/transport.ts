import { ObfuscationService } from "./service";

export class ObfuscationTransport {
  private readonly obfuscationService: ObfuscationService =
    new ObfuscationService();

  private readonly routes: IRoute[] = [
    {
      handler: (req) => this.obfuscationService.obfuscate(req),
      method: "POST",
      path: "/api/v1/obfuscation/obfuscate",
    },
  ];

  public getRoutes(): IRoute[] {
    return this.routes;
  }
}
