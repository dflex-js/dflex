import { IDepth } from "./types";

class Depth implements IDepth {
  containers: {
    [depth: number]: string[];
  };

  constructor() {
    this.containers = {};
  }

  add(SK: string, depth: number) {
    if (!Array.isArray(this.containers[depth])) {
      this.containers[depth] = [SK];

      return;
    }

    const is = this.containers[depth].find((k) => k === SK);

    if (!is) {
      this.containers[depth].push(SK);
    }
  }

  getByDepth(depth: number) {
    return this.containers[depth] || [];
  }

  removeByDepth(depth: number) {
    if (!this.containers[depth]) return;

    delete this.containers[depth];
  }

  removeAll() {
    this.containers = {};
  }
}

export default Depth;
