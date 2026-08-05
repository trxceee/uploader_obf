import type { FormDataEntryValue } from "bun";
import { JavaProcess } from "../process";
import { obfuscateSchema, type ObfuscateDto } from "./model/schemas";
import { join } from "path";
import { rm } from "fs/promises";
import { getEnv } from "../../shared/utils";
import type { FormdataObfuscationBody } from "./model/types";

export class ObfuscationService {
  private readonly javaProcess: JavaProcess = new JavaProcess();

  public async obfuscate(req: Request): Promise<Response> {
    const formdata = await this.getFormData(req);
    if (formdata instanceof Response) return formdata;

    const file = formdata.get("file");

    const validatedFile = this.validateJarFile(file);
    if (validatedFile instanceof Response) return validatedFile;

    const body = this.getBody(formdata);

    const validatedBody = this.validateBody(body);
    if (validatedBody instanceof Response) return validatedBody;

    let tempDir: string | undefined;

    try {
      tempDir = await this.javaProcess.runProcess(
        validatedFile,
        validatedBody.client,
        validatedBody.isFabric,
      );

      return await this.writeFileToResponse(tempDir, validatedBody.isFabric);
    } catch (error) {
      console.error("Ошибка обфускации:", error);

      return new Response("Ошибка при обфускации", { status: 500 });
    } finally {
      if (tempDir) {
        rm(tempDir, {
          recursive: true,
          force: true,
        }).catch((err) =>
          console.error("Не удалось удалить tempDir:", err),
        );
      }
      console.log("Процесс обфускации успешно завершён")
    }
  }

  private getBody(formdata: FormData): FormdataObfuscationBody {
    return {
      client: formdata.get("client"),
      isFabric: formdata.get("isFabric"),
    };
  }

  private validateBody(body: FormdataObfuscationBody): Response | ObfuscateDto {
    const result = obfuscateSchema.safeParse(body);

    if (!result.success) {
      return new Response(result.error.message, {
        status: 400,
      });
    }

    return result.data;
  }

  private async getFormData(req: Request): Promise<any | Response> {
    try {
      return await req.formData();
    } catch {
      return new Response("Некорректный multipart/form-data", {
        status: 400,
      });
    }
  }

  private async writeFileToResponse(
    tempDir: string,
    isFabric: boolean,
  ): Promise<Response> {
    const filename = isFabric
      ? getEnv("FABRIC_JAR_NAME")
      : getEnv("MCP_JAR_NAME");

    const jarPath = join(tempDir, "jars", filename);

    const jarFile = Bun.file(jarPath);

    if (!(await jarFile.exists())) {
      return new Response("Результат обфускации не найден", {
        status: 500,
      });
    }

    const buffer = await jarFile.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/java-archive",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  private validateJarFile(file: FormDataEntryValue | null): Response | File {
    if (
      !file ||
      !(file instanceof File) ||
      !file.name.toLowerCase().endsWith(".jar")
    ) {
      return new Response("Некорректный файл", {
        status: 400,
      });
    }

    return file;
  }
}
