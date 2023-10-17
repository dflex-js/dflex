import type { DFlexListenerEvents } from "../Listeners";
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
  evt?: DFlexListenerEvents,
) {
  if (options && options.onUpdate) {
    store.deferred.push(options.onUpdate);
  }

  if (updateFn === null) {
    return;
  }

  try {
    updateFn();
  } catch (error: unknown) {
    if (error instanceof Error) {
      store.deferred.push(
        store.listeners.notify.bind(null, {
          type: "error",
          error,
        }),
      );
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  } finally {
    if (evt) {
      store.deferred.push(store.listeners.notify.bind(null, evt));
    }
  }
}

function scheduler(
  store: DFlexDnDStore,
  updateFn: UpdateFn | null,
  options: SchedulerOptions | null,
  evt?: DFlexListenerEvents,
) {
  if (store.isUpdating) {
    store.updatesQueue.push([updateFn, options, evt]);

    return;
  }

  const initialIsUpdating = store.isUpdating;

  store.isUpdating = true;

  try {
    execTask(store, updateFn, options, evt);
  } finally {
    queueMicrotask(() => {
      execDeferredFn(store, store.deferred);

      if (store.updatesQueue.length) {
        const [_updateFn, _options, _evt] = store.updatesQueue.shift()!;
        store.isUpdating = initialIsUpdating;
        scheduler(store, _updateFn, _options, _evt);
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
  evt?: DFlexListenerEvents,
) => void;

export type { Scheduler, SchedulerOptions, UpdateFn };

export default scheduler;
