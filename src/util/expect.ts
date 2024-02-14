export const expect = <T>(f: () => T): T | undefined => {
  try {
    return f();
  } catch (e) {
    return undefined;
  }
};
