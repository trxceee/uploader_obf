import { join, resolve } from "path";
import { FilesService } from "../files";
import { YamlService } from "../yaml";
import { spawn } from "child_process";
import { mkdir } from "fs/promises";

export class JavaProcess {
  private readonly filesService: FilesService = new FilesService();
  private readonly yamlService: YamlService = new YamlService();

  public async runProcess(
    jarFile: File,
    clientName: string,
    isFabric: boolean,
  ): Promise<boolean> {
    return new Promise(async (res, rej) => {
      const baseDir = process.env.OBF_BASE_DIRECTORY ?? resolve();
      const tempDir = await this.filesService.createTempDir(clientName);

      const configName = process.env.CONFIG_NAME ?? "config.yml";
      const configFile = join(baseDir, configName);
      const configTempPath = join(tempDir, configName);

      const jarsPath = join(tempDir, "jars");

      const javaArgs = [
        "-jar",
        "obfuscation.jar",
        ...(isFabric ? ["true"] : []),
        configTempPath,
      ];

      console.log("tempDir:", tempDir);
      console.log("javaArgs:", javaArgs);

      //   Копирование джарку в временную директорию
      await mkdir(jarsPath);
      const tempJar = join(jarsPath, "input.jar");
      await Bun.write(tempJar, jarFile);

      //  Копирование конфига и патч с корректными данными
      await this.filesService.copyFile(configFile, configTempPath);
      await this.yamlService.editConfig(tempDir, configName);

      // Запуск чайлд процесса
      const childProcess = spawn("java", javaArgs, {
        cwd: baseDir,
      });

      childProcess.stdout.on("data", (chunk) => {
        console.log(`STDOUT: `, chunk.toString("utf-8"));
      });

      childProcess.stderr.on("data", (chunk) => {
        console.error(`STDERR: `, chunk.toString("utf-8"));
      });

      childProcess.on("error", (err) => {
        console.error(`PROCESS ERROR: `, err);
      });

      childProcess.on("close", (code) => {
        if (code !== 0) rej(`Процесс завершился с кодом: ${code}`);
        console.log("Процесс обфускации успешно завершён");
        res(true);
      });
    });
  }
}
