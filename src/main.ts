import { fileURLToPath } from "url";
import { Router } from "./core/router";
import { Server } from "./core/server";
import { spawn } from "child_process";
import path, { join } from "path";


async function main() {
  // const router = new Router();
  // const server = new Server(router);

  // const port = Number(process.env.PORT) ?? 5000;
  // server.run(port);

  // const __filename = fileURLToPath(import.meta.file);
  // const __dirname = path.dirname(__filename);

  const pathToJar = path.resolve("D:", "/autoupd");
  console.log(pathToJar)
  const process = spawn("java", ["-jar", "obfuscation.jar"], {
    cwd: pathToJar,
  });

  process.stdout.on("data", (data) => {
    console.log("stdout:", data.toString());
  });

  process.stderr.on("data", (data) => {
    console.error("stderr:", data.toString());
  });

  process.on("close", (code) => {
    console.log("Процесс завершился:", code);
  });

  process.on("error", (error) => {
    console.error("Не удалось запустить:", error);
  });
}

await main();
