import YAML from "yaml";
import { join } from "path";

export class YamlService {
  public async editConfig(path: string, fileName: string): Promise<void> {
    const configPath = join(path, fileName);
    const configFile = await Bun.file(configPath).text();
    const config = YAML.parse(configFile) as any;
    config.input = join(path, "jars", "input.jar");
    config.output = join(path, "jars", "output.jar");

    await Bun.write(configPath, YAML.stringify(config));
  }
}
