import { YAML } from "bun";
import { join } from "path";

export class YamlService {
  public async editConfig(path: string, fileName: string): Promise<void> {
    const configFile = await Bun.file(join(path, fileName)).text();
    const config = YAML.parse(configFile) as any;
    config.input = join(path, "jars", "input.jar");
    config.output = join(path, "jars", "output.jar");

    await Bun.write(configFile, YAML.stringify(config));
  }
}
