<template>
  <ul>
    <DnD v-for="item in items" :key="item.id" :tag="'li'" :id="item.id">
      {{ item.text }}
    </DnD>
  </ul>
</template>

<script setup lang="ts">
import DnD from './DnDItem.vue'

const items = [
  { id: 'item1', text: 'Item 1' },
  { id: 'item2', text: 'Item 2' },
  { id: 'item3', text: 'Item 3' },
  { id: 'item4', text: 'Item 4' }
]
</script>
