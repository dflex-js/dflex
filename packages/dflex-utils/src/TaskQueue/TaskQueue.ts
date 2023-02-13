class TaskQueue {
  private _timeoutId?: ReturnType<typeof setTimeout>;

  private _elmInQueue: Set<string>;

  private _queue: (() => unknown)[];

  constructor() {
    this._queue = [];
    this._elmInQueue = new Set();
  }

  add(fn: () => void, elmKey?: string): void {
    this._queue.push(fn);

    if (elmKey) {
      this._elmInQueue.add(elmKey);
    }
  }

  cancelQueuedTask(): void {
    if (this._timeoutId !== undefined) {
      // postpone queue.
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }

  clear(): void {
    this.cancelQueuedTask();
    this._queue = [];
    this._elmInQueue.clear();
  }

  hasElm(elmKey: string): boolean {
    return this._elmInQueue.has(elmKey);
  }

  handleQueue(): unknown[] {
    const res: unknown[] = [];

    try {
      if (this._queue.length === 0) {
        return res;
      }

      const q = this._queue;
      this._queue = [];
      q.forEach((fn) => {
        const r = fn();
        res.push(r);
      });
    } finally {
      this._timeoutId = undefined;
      this._elmInQueue.clear();
    }

    return res;
  }

  private _schedule(): void {
    this._timeoutId = setTimeout(() => {
      this.handleQueue();
    }, 0);
  }

  scheduleNextTask(): void {
    if (this._timeoutId === undefined) {
      this._schedule();
    }
  }
}

export default TaskQueue;
