import { mkdir, mkdtemp, rename, rm, access } from "fs/promises";
import { tmpdir } from "os";
import { basename, dirname, join } from "path";

export class FileService {
  // dirs

  public async createTempDir(clientName = "heavy"): Promise<string> {
    return mkdtemp(join(tmpdir(), `${clientName}-`));
  }

  public async deleteDir(path: string): Promise<void> {
    await this.checkExistence(path);

    await rm(path, {
      recursive: true,
      force: true,
    });

    console.log(`Директория "${basename(path)}" успешно удалена`);
  }

  // files

  public async moveFile(from: string, to: string): Promise<void> {
    await this.checkExistence(from);

    await mkdir(dirname(to), {
      recursive: true,
    });

    await rename(from, to);

    console.log(`Успешный перенос с "${from}" в "${to}"`);
  }

  // helpers

  public async checkExistence(path: string): Promise<void> {
    try {
      await access(path);
    } catch {
      throw new Error(`Путь "${path}" не существует`);
    }
  }
}
