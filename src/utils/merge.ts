type Mergeable = Record<string, unknown> | undefined;

export const merge = <T extends Mergeable, S extends Mergeable>(
  target: T,
  ...sources: S[]
): T => {
  const result = { ...target } as Record<string, unknown>;
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    for (const key of Object.keys(source)) {
      const srcVal = source[key];
      const tgtVal = result[key];
      if (
        srcVal &&
        typeof srcVal === 'object' &&
        !Array.isArray(srcVal) &&
        tgtVal &&
        typeof tgtVal === 'object' &&
        !Array.isArray(tgtVal)
      ) {
        result[key] = merge(
          tgtVal as Record<string, unknown>,
          srcVal as Record<string, unknown>,
        );
      } else {
        result[key] = srcVal;
      }
    }
  }
  return result as T;
};
