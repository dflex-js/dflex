type KY = number | string;

function combineKeys(k1: KY, k2: KY, pref: string | null = null) {
  const k = `${k1}-${k2}`;

  return pref ? `${pref}-${k}` : k;
}

export default combineKeys;
