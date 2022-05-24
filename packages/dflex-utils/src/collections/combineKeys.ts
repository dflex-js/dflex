type KY = number | string;

function combineKeys(k1: KY, k2: KY) {
  return `${k1}-${k2}`;
}

export default combineKeys;
