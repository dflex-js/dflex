// eslint-disable-next-line no-unused-vars
type EventCallback = (event: Event) => void;

interface EventInstance {
  eventName: string;
  eventCallback: EventCallback;
}

const eventInstances: EventInstance[] = [];

export type EventCleanup = () => void;

function DFlexCreateEvent(
  eventName: string,
  callback: EventCallback,
): EventCleanup {
  function eventHandler(event: Event): void {
    callback(event);
  }

  window.addEventListener(eventName, eventHandler);

  const instance: EventInstance = {
    eventName,
    eventCallback: eventHandler,
  };

  eventInstances.push(instance);

  function cleanup(): void {
    window.removeEventListener(eventName, eventHandler);
    const index = eventInstances.indexOf(instance);
    if (index !== -1) {
      eventInstances.splice(index, 1);
    }
  }

  return cleanup;
}

function autoCleanupAllEvents(): void {
  eventInstances.forEach(({ eventName, eventCallback }) => {
    window.removeEventListener(eventName, eventCallback);
  });

  eventInstances.length = 0;
}

export { DFlexCreateEvent, autoCleanupAllEvents };
