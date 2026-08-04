import { YAML } from "bun";
import { join } from "path";

export class YamlService {
  public async editConfig(path: string, fileName: string) {
    const config = YAML.parse(join(path, fileName)) as any;
    config.input = join(path, "jars", "input.jar");
    config.output = join(path, "jars", "output.jar");

    await Bun.write(join(path, fileName), YAML.stringify(config));
  }
}
