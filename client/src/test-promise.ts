export const another = async (): Promise<void> => {
  await Promise.resolve();
};

export const test = async (): Promise<void> => {
  return another();
};
