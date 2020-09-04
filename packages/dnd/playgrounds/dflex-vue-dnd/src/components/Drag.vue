<template>
  <ul :id="id" :ref="id">
    <slot></slot>
  </ul>
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
  },

  mounted() {
    // Register element in store
    store.register({ id: this.id, element: this.$refs[this.id] });
  },
}
</script>

<style>
ul {
  /* display: flex; */
  flex-direction: column;
  list-style: none;
  margin: 10px;
  padding: 8px;
  border: 4px #bac5c7 solid;
  background: #cecece;
  height: fit-content;
}
</style>