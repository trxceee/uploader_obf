export const getEnv = (name: string) => {
  const variable = process.env[name];
  if (!variable) throw new Error(`Переменна окружения "${name}" не найдена`);
  return variable;
};
