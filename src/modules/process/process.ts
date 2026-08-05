import { join } from "path";
import { spawn } from "child_process";
import { mkdir } from "fs/promises";

import { FilesService } from "../files";
import { YamlService } from "../yaml";
import { getEnv } from "../../shared/utils";

export class JavaProcess {
  private readonly filesService = new FilesService();
  private readonly yamlService = new YamlService();

  public async runProcess(
    jarFile: File,
    clientName: string,
    isFabric: boolean,
  ): Promise<string> {
    const baseDir = getEnv("OBF_BASE_DIRECTORY");
    const configName = getEnv("CONFIG_NAME");

    const tempDir = await this.filesService.createTempDir(clientName);
    const configPath = await this.prepareConfig(baseDir, tempDir, configName);

    await this.prepareInputJar(tempDir, jarFile);

    await this.executeJavaObfuscation({
      baseDir,
      isFabric,
      configPath,
    });

    return tempDir;
  }

  private async prepareInputJar(tempDir: string, jarFile: File): Promise<void> {
    const jarsDir = join(tempDir, "jars");
    await mkdir(jarsDir, { recursive: true });

    const inputJarPath = join(jarsDir, getEnv("INPUT_JAR_NAME"));
    await Bun.write(inputJarPath, jarFile);
  }

  private async prepareConfig(
    baseDir: string,
    tempDir: string,
    configName: string,
  ): Promise<string> {
    const defaultConfig = join(baseDir, configName);
    const targetConfig = join(tempDir, configName);

    await this.filesService.copyFile(defaultConfig, targetConfig);
    await this.yamlService.editConfig(tempDir, configName);

    return targetConfig;
  }

  private executeJavaObfuscation({
    baseDir,
    configPath,
    isFabric,
  }: {
    baseDir: string;
    configPath: string;
    isFabric: boolean;
  }): Promise<void> {
    const args = [
      "-jar",
      "obfuscation.jar",
      ...(isFabric ? ["true"] : []),
      configPath,
    ];

    return new Promise((resolve, reject) => {
      const process = spawn("java", args, { cwd: baseDir });

      process.stdout.on("data", (chunk) => {
        console.log(`STDOUT: ${chunk.toString()}`);
      });

      process.stderr.on("data", (chunk) => {
        console.error(`STDERR: ${chunk.toString()}`);
      });

      process.on("error", reject);

      process.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Процесс обфускации завершился с кодом ${code}`));
          return;
        }

        resolve();
      });
    });
  }
}
