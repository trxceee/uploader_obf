import YAML from "yaml";
import { join } from "path";
import { getEnv } from "../../shared/utils";

export class YamlService {
  public async editConfig(path: string, fileName: string): Promise<void> {
    const configPath = join(path, fileName);
    const configFile = await Bun.file(configPath).text();
    const config = YAML.parse(configFile) as any;

    config.input = join(path, "jars", getEnv("INPUT_JAR_NAME"));
    config.output = join(path, "jars", getEnv("OUTPUT_JAR_NAME"));

    config.mcpJarName = getEnv("MCP_JAR_NAME");
    config.fabricJarName = getEnv("FABRIC_JAR_NAME");

    await Bun.write(configPath, YAML.stringify(config));
  }
}
