import { TaskQueue } from "../src";

jest.useFakeTimers();

describe("TaskQueue", () => {
  let taskQueue: TaskQueue;

  beforeEach(() => {
    taskQueue = new TaskQueue();
  });

  afterEach(() => {
    taskQueue.clear();
  });

  test("enqueueBeforeLast should add tasks to the queue in the correct order", () => {
    const queueKey = "myQueue";

    const fn1 = jest.fn(() => "Function 1");
    const fn2 = jest.fn(() => "Function 2");

    taskQueue.enqueueBeforeLast(fn1, fn2, queueKey);

    const results = taskQueue.executeQueue(queueKey);

    expect(results).toEqual(["Function 2", "Function 1"]);

    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test("add should add a task to the queue", () => {
    const queueKey = "myQueue";
    const fn = jest.fn(() => "Function Result");

    taskQueue.enqueue(fn, queueKey);

    const results = taskQueue.executeQueue(queueKey);

    expect(results).toEqual(["Function Result"]);

    expect(fn).toHaveBeenCalled();
  });

  test("hasElm should return true if the element exists in the queue", () => {
    const elmKey = "myElement";
    taskQueue.enqueue(() => {}, "myQueue", elmKey);

    expect(taskQueue.hasElm(elmKey)).toBe(true);
  });

  test("scheduleNextTask should schedule the next task execution", () => {
    const queueKey1 = "queue1";
    const queueKey2 = "queue2";

    const fn1 = jest.fn();
    const fn2 = jest.fn();

    taskQueue.enqueue(fn1, queueKey1);
    taskQueue.enqueue(fn2, queueKey2);

    taskQueue.scheduleNextTask([queueKey1, queueKey2]);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(fn1).toHaveBeenCalled();
    expect(fn2).toHaveBeenCalled();
  });

  test("cancelQueuedTask should cancel the scheduled task", () => {
    const queueKey1 = "myQueue1";
    const queueKey2 = "myQueue2";

    const fn1 = jest.fn();
    const fn2 = jest.fn();

    taskQueue.enqueue(fn1, queueKey1);
    taskQueue.enqueue(fn2, queueKey2);

    taskQueue.scheduleNextTask([queueKey1, queueKey2]);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    taskQueue.cancelQueuedTask();

    jest.runAllTimers();

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  test("clear should clear the queue and cancel any scheduled tasks", () => {
    const queueKey = "myQueue";
    const fn = jest.fn();

    taskQueue.enqueueBeforeLast(fn, () => {}, queueKey);

    taskQueue.scheduleNextTask([queueKey, queueKey]);
    expect(fn).not.toHaveBeenCalled();

    taskQueue.clear();
    jest.runAllTimers();

    expect(fn).not.toHaveBeenCalled();
    expect(taskQueue.executeQueue(queueKey)).toEqual([]);
  });
});
