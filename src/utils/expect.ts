export const expect = <T>(f: () => T): T | undefined => {
  try {
    return f();
  } catch (e) {
    return undefined;
  }
};

export const expectAsync = async <T>(f: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await f();
  } catch (e) {
    return undefined;
  }
};
