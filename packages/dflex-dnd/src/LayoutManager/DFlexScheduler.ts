import type { DFlexListenerNotifications } from "../Listeners";
import type DFlexDnDStore from "./DFlexDnDStore";

type UpdateFn = () => void;
type Deferred = (() => void)[];

type SchedulerOptions = {
  onUpdate?: () => void;
};

function execDeferredFn(store: DFlexDnDStore, deferred: Deferred) {
  store.deferred = [];
  deferred.forEach((fn) => fn());
}

function execTask(
  store: DFlexDnDStore,
  updateFn: UpdateFn | null,
  options: SchedulerOptions | null,
) {
  const { deferred, listeners } = store;

  if (options && options.onUpdate) {
    deferred.push(options.onUpdate);
  }

  if (updateFn === null) {
    return;
  }

  try {
    updateFn();
  } catch (error: unknown) {
    if (listeners && error instanceof Error) {
      deferred.push(() =>
        listeners.notify({
          type: "error",
          error,
        }),
      );
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

function scheduler(
  store: DFlexDnDStore,
  updateFn: UpdateFn | null,
  options: SchedulerOptions | null,
) {
  if (store.isUpdating) {
    store.updatesQueue.push([updateFn, options]);

    return;
  }

  const initialIsUpdating = store.isUpdating;

  store.isUpdating = true;

  try {
    execTask(store, updateFn, options);
  } finally {
    queueMicrotask(() => {
      execDeferredFn(store, store.deferred);

      if (store.updatesQueue.length) {
        const [_updateFn, _options] = store.updatesQueue.shift()!;
        store.isUpdating = initialIsUpdating;
        scheduler(store, _updateFn, _options);
      }

      store.isUpdating = initialIsUpdating;
    });
  }
}

type Scheduler = (
  // eslint-disable-next-line no-unused-vars
  store: DFlexDnDStore,
  // eslint-disable-next-line no-unused-vars
  updateFn: UpdateFn | null,
  // eslint-disable-next-line no-unused-vars
  options: SchedulerOptions | null,
  // eslint-disable-next-line no-unused-vars
  evt?: DFlexListenerNotifications,
) => void;

export type { Scheduler, SchedulerOptions, UpdateFn };

export default scheduler;
