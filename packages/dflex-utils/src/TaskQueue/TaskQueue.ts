type QKey = string;
type Queue = (() => unknown)[];

class TaskQueue {
  private _timeoutId?: ReturnType<typeof setTimeout>;

  private _elmInQueue: Set<string>;

  private _queue: Record<QKey, Queue>;

  constructor() {
    this._queue = {};
    this._elmInQueue = new Set();
  }

  insertBeforeEnd(
    lastElmFn: () => unknown,
    fnBeforeEnd: () => unknown,
    queueKey: QKey,
    elmKey?: string
  ): void {
    if (!Array.isArray(this._queue[queueKey])) {
      this._queue[queueKey] = [];
    }

    const l = this._queue[queueKey].length;

    if (l === 0) {
      this._queue[queueKey].push(fnBeforeEnd);
    } else {
      this._queue[queueKey][l - 1] = fnBeforeEnd;
    }

    this._queue[queueKey].push(lastElmFn);

    if (elmKey) {
      this._elmInQueue.add(elmKey);
    }
  }

  add(fn: () => unknown, queueKey: QKey, elmKey?: string): void {
    if (!Array.isArray(this._queue[queueKey])) {
      this._queue[queueKey] = [];
    }

    this._queue[queueKey].push(fn);

    if (elmKey) {
      this._elmInQueue.add(elmKey);
    }
  }

  cancelQueuedTask(): void {
    if (this._timeoutId !== undefined) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }

  clear(): void {
    this.cancelQueuedTask();
    this._queue = {};
    this._elmInQueue.clear();
  }

  hasElm(elmKey: string): boolean {
    return this._elmInQueue.has(elmKey);
  }

  handleQueue(queueKey: QKey): unknown[] {
    const res: unknown[] = [];

    try {
      if (
        !Array.isArray(this._queue[queueKey]) ||
        this._queue[queueKey].length === 0
      ) {
        return res;
      }

      const q = this._queue[queueKey];
      this._queue[queueKey] = [];
      q.forEach((fn) => {
        const r = fn();
        res.push(r);
      });
    } catch (e: unknown) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    } finally {
      this._timeoutId = undefined;
    }

    return res;
  }

  private _schedule(keys: QKey[]): void {
    this._timeoutId = setTimeout(() => {
      this.handleQueue(keys[0]);
      queueMicrotask(() => this.handleQueue(keys[1]));
      this._elmInQueue.clear();
    }, 0);
  }

  scheduleNextTask(keys: QKey[]): void {
    if (this._timeoutId === undefined) {
      this._schedule(keys);
    }
  }
}

export default TaskQueue;
