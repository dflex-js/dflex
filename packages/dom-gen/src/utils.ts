/**
 * Generates unique key by combined depth with element current index.
 *
 * Ideally, each element should be connected with parent-id.
 * If we have element-id1, we should know who's the parent by parent-id.
 * But, currently this is not possible children render first. Instead,
 * we use counters combined with depth as parent-identifier. Vice-versa.
 */
function genKey(dp: number, i: number): string {
  return `${dp}-${i}`;
}

export default genKey;
