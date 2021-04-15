/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

function genKey(dp: number, i: number): string {
  return `${dp}-${i}`;
}

export default genKey;
