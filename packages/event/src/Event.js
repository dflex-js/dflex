class Event {
  constructor(eventType) {
    this.eventType = eventType;
  }

  create(detail = {}) {
    this.event = new CustomEvent(this.eventType, { detail });
  }

  addListener(elem, handler) {
    elem.addEventListener(this.eventType, handler, false);
  }

  dispatch(elem) {
    elem.dispatchEvent(this.event);
  }
}

export default Event;
