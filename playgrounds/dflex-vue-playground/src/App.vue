<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import List from './components/DnDList.vue'
import { store } from '@dflex/dnd'

// Effect for layoutState
onMounted(() => {
  const unsubscribeLayout = store.listeners.subscribe((e) => {
    console.info('new layout state', e)
  }, 'layoutState')

  onBeforeUnmount(() => {
    unsubscribeLayout()
  })
})

// Effect for mutation
onMounted(() => {
  const unsubscribeMutation = store.listeners.subscribe((e) => {
    console.info('new mutation state', e)
  }, 'mutation')

  onBeforeUnmount(() => {
    unsubscribeMutation()
  })
})
</script>

<template>
  <List />
</template>

<style scoped></style>
