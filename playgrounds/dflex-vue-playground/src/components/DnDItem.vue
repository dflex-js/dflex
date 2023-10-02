<template>
  <component :is="tag" :id="id" style="touch-action: none" @pointerdown="onPointerDown">
    <template v-for="slot of Object.keys($slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { store, DnD } from '@dflex/dnd'

const props = defineProps({
  tag: { type: [String, Object], required: true },
  id: { type: String, required: true }
})

store.register({ id: props.id })
onUnmounted(() => {
  store.unregister(props.id)
})

let dndSession: DnD | null = null

function onPointerDown(event: PointerEvent): void {
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  target.addEventListener('pointermove', onPointerMove)
  target.addEventListener('pointerup', onPointerUp)
  dndSession = new DnD(props.id, { x: event.clientX, y: event.clientY })
}

function onPointerMove(event: PointerEvent) {
  dndSession!.dragAt(event.clientX, event.clientY)
}

function onPointerUp(event: PointerEvent): void {
  const target = event.currentTarget as HTMLElement
  target.removeEventListener('pointermove', onPointerMove)
  target.removeEventListener('pointerup', onPointerUp)
  dndSession!.endDragging()
  dndSession = null
}
</script>
