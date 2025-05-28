export const removeFalsyValues =<T extends Record<string, any>>(obj: T): Record<string,any> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => Boolean(value))
    );
  }