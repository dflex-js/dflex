<template>
  <div @mousedown.prevent="onMouseDown" class="Container">
    <Drag :id="generateKey()">
      <Core v-for="n in [1]" :key="'left-' + n" :id="generateKey()" :content="'Hello-' + n" />
    </Drag>
    <Drag :id="generateKey()">
      <Core
        v-for="n in [1, 2, 3, 4, 5, 6, 7]"
        :key="'center-' + n"
        :id="generateKey()"
        :content="'Hello-' + n"
      />
    </Drag>
    <Drag :id="generateKey()">
      <Core v-for="n in [1, 2, 3]" :key="'right-' + n" :id="generateKey()" :content="'Hello-' + n" />
    </Drag>
  </div>
</template>

<script>
// Import dependencies
import { DnD } from "@dflex/dnd/src";
import { keyGenerator } from "@folo/utils";
// Import components
import Drag from "./Drag.vue";
import Core from "./Core.vue";

export default {
  name: "Container",

  components: {
    Core,
    Drag,
  },

  data() {
    return {
      id: keyGenerator(new Date().getTime()),
      mouseEvents: null,
      draggable: null,
      draggedID: null,
    };
  },

  methods: {
    generateKey() {
      return keyGenerator(new Date().getTime().toString());
    },

    onMouseDown(e) {
      const { target, button, clientX, clientY } = e;
      // avoid right mouse click and ensure id
      if (typeof button === "number" && button === 0) {
        const { id } = target;
        if (id) {
          this.draggedID = id;
          this.draggable = new DnD(id, { x: clientX, y: clientY });
          this.mouseEvents = [
            {
              evType: "mousemove",
              evTarget: document,
              handler: this.onMouseMove,
            },
            { evType: "mouseup", evTarget: document, handler: this.onMouseUp },
          ];
          this.mouseEvents.forEach(({ evType, evTarget, handler }) => {
            evTarget.addEventListener(evType, handler);
          });
        }
      }
    },

    onMouseUp() {
      if (this.draggedID) {
        this.mouseEvents.forEach(({ evType, evTarget, handler }) => {
          evTarget.removeEventListener(evType, handler);
        });
        this.draggable.endDragging();
      }
    },

    onMouseMove(e) {
      if (this.draggedID) {
        const { clientX, clientY } = e;
        this.draggable.dragAt(clientX, clientY);
      }
    },
  },
};
</script>

<style scoped>
.Container {
  display: flex;
  width: 41.53rem;
  /* border: 4px green solid; */
  background: #07718f;
}
</style>
