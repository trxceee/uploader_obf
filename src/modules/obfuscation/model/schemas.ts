import z from "zod";

export const obfuscateSchema = z.object({
  client: z
    .string({ message: "Поле должно быть строкой" })
    .min(1, { message: "Минимальная длинна поля 1 символ" })
    .max(20, { message: "Максимальная длинна поля 20 символов" }),
  isFabric: z.coerce.boolean({ message: "Поле должно быть булевым" }),
});

export interface ObfuscateDto extends z.infer<typeof obfuscateSchema> {}
