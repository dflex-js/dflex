<template>
  <div class="root">
    <div class="todo">
      <ul>
        <DFlexDnDComponent
          v-for="{ msg, id, style } in tasks"
          :Component="'li'"
          :registerInput="{ id }"
          :key="id"
          :style="style"
          :opts="{
            commit: {
              enableAfterEndingDrag: false,
              enableForScrollOnly: false
            }
          }"
        >
          {{ msg }}
        </DFlexDnDComponent>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import DFlexDnDComponent from './DFlexDnDComponent.vue'

export default {
  components: {
    DFlexDnDComponent
  },
  data() {
    return {
      tasks: [
        { id: 'mtg', msg: 'Meet with Laura', style: { height: '3rem' } },
        { id: 'org', msg: 'Organize weekly meetup', style: { height: '6.5rem' } },
        { id: 'proj', msg: 'Continue working on the project', style: { height: '5rem' } },
        { id: 'gym', msg: 'Hit the gym', style: { height: '4.5rem' } }
      ]
    }
  }
}
</script>

<style scoped>
.root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: rgba(243, 244, 246, 1);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-radius: 0.75rem;
}

.todo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.todo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.todo > ul {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 0.5rem;
  background-color: #070302;
  padding: 0;
  margin: 0;
}

.todo > ul > li {
  background-color: #8917e0;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: pointer;
  width: 12rem;
  padding: 1.5rem 1.5rem;
  margin: 0.6rem 0.6rem;
  font-weight: 500;
  font-size: 1rem;
  white-space: normal;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  outline: none;
}
</style>
