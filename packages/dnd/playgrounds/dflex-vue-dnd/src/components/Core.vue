<template>
  <li :id="id" :ref="id">{{content}}</li>
</template>

<script>
import { store } from "@dflex/dnd/src";

export default {
  props: {
    id: {
      type: String,
      required: true,
      default: Math.random().toString(),
    },
    content: {},
  },

  mounted() {
    // Register element in store -- Notice lower depth than the parent component!
    store.register({ id: this.id, element: this.$refs[this.id], depth: 0 });
  },
};
</script>

<style scoped>
li {
  position: relative;
  width: 150px;
  height: 30px;
  box-shadow: none;
  margin-bottom: 8px;
  margin-top: 4px;
  user-select: none;
  color: rgb(9, 30, 66);
  background: whitesmoke;
  border-radius: 2px;
  border-width: 2px;
  border-style: solid;
  border-image: initial;
  border-color: transparent;
  padding: 8px;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1) 0s;
}
</style>
