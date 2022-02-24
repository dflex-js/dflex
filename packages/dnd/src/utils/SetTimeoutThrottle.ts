class SetTimeoutThrottle {
  private delay: number;

  private timer: ReturnType<typeof setTimeout> | null;

  constructor(delay: number) {
    this.delay = delay;
    this.timer = null;
  }

  execute(fn: () => void) {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      fn();
    }, this.delay);
  }

  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}

export default SetTimeoutThrottle;
