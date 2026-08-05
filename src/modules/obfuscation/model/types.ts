import type { FormDataEntryValue } from "bun";

export type FormdataObfuscationBody = {
  client: FormDataEntryValue | null;
  isFabric: FormDataEntryValue | null;
};