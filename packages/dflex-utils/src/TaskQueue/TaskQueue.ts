import { DFlexCreateTimeout } from "../environment";

type QKey = string;
type Queue = (() => unknown)[];

const [timeout, cancelTimeout] = DFlexCreateTimeout(0);

class TaskQueue {
  private _elmInQueue: Set<string>;

  private _queue: Record<QKey, Queue>;

  constructor() {
    this._queue = {};
    this._elmInQueue = new Set();
  }

  private _intiQueueRecord(queueKey: string): void {
    if (!Array.isArray(this._queue[queueKey])) {
      this._queue[queueKey] = [];
    }
  }

  private _addFuncToQueueRecord(
    fn: () => unknown,
    queueKey: string,
    elmKey?: string
  ) {
    this._queue[queueKey].push(fn);

    if (elmKey) {
      this._elmInQueue.add(elmKey);
    }
  }

  _isEmpty(queueKey: string): boolean {
    return (
      !Array.isArray(this._queue[queueKey]) ||
      this._queue[queueKey].length === 0
    );
  }

  _hasElm(elmKey: string): boolean {
    if (__DEV__) {
      if (!this._elmInQueue.has) {
        throw new Error(
          `The element with key ${elmKey} does not exist in the queue.`
        );
      }
    }
    return this._elmInQueue.has(elmKey);
  }

  _enqueueBeforeLast(
    lastElmFn: () => unknown,
    beforeLastFn: () => unknown,
    queueKey: QKey,
    elmKey?: string
  ): void {
    this._intiQueueRecord(queueKey);

    const { length } = this._queue[queueKey];

    if (length === 0) {
      this._queue[queueKey].push(beforeLastFn);
    } else {
      this._queue[queueKey][length - 1] = beforeLastFn;
    }

    this._addFuncToQueueRecord(lastElmFn, queueKey, elmKey);
  }

  _enqueue(fn: () => unknown, queueKey: QKey, elmKey?: string): void {
    this._intiQueueRecord(queueKey);
    this._addFuncToQueueRecord(fn, queueKey, elmKey);
  }

  /**
   * Executes the queued tasks for the specified queue key, bypassing the scheduled execution.
   *
   * @param queueKey - The key of the queue to execute.
   * @returns An array containing the results of executing the tasks in the queue.
   */
  _executeQueue(queueKey: QKey): unknown[] {
    const res: unknown[] = [];

    if (this._isEmpty(queueKey)) {
      return res;
    }

    try {
      const q = this._queue[queueKey];

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
      cancelTimeout();
      delete this._queue[queueKey];
    }

    return res;
  }

  private _schedule(keys: [QKey, QKey | undefined]): void {
    const f = () => {
      const [k1, k2] = keys;

      this._executeQueue(k1);

      if (k2) {
        queueMicrotask(() => this._executeQueue(k2));
      }

      this._elmInQueue.clear();
    };

    timeout(f, true);
  }

  _scheduleNextTask(keys: [QKey, QKey | undefined]): void {
    this._schedule(keys);
  }

  // eslint-disable-next-line class-methods-use-this
  _cancelQueuedTask(): void {
    cancelTimeout();
  }

  _clear(): void {
    cancelTimeout();
    this._queue = {};
    this._elmInQueue.clear();
  }
}

export default TaskQueue;
