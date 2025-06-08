export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;

    const valA = (a as Record<string, unknown>)[key];
    const valB = (b as Record<string, unknown>)[key];

    if (!deepEqual(valA, valB)) return false;
  }

  return true;
};