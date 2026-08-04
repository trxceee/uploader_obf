import { copyFile, exists, mkdir, mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export class FilesService {
  public async createTempDir(clientName: string = "heavy") {
    return mkdtemp(join(tmpdir(), `${clientName}-`));
  }

  public async copyFile(from: string, to: string): Promise<void> {
    await this.checkExistance(from);
    await mkdir(to);
    await copyFile(from, to);
    console.log(`Файл "${from} успешно скопирован в "${to}""`);
  }

  public async checkExistance(path: string): Promise<void> {
    if (!(await exists(path))) throw new Error(`"${path} не существует"`);
  }
}
