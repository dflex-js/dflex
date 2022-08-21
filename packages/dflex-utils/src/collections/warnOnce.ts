/* eslint-disable no-console */
const log: Record<string, boolean> = {};

function warnOnce(caller: string, ...message: any[]): void {
  if (!log[caller]) {
    log[caller] = true;
    console.warn(...message);
  }
}

export default warnOnce;
