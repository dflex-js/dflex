<template>
  <component
    :is="Component"
    ref="taskRef"
    :id="registerInput.id"
    @pointerdown="onPointerDown"
    :class="className"
    :style="style"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { store, DnD, DFlexEvents } from '@dflex/dnd'

interface RegisterInput {
  id: string
  depth?: number
  readonly?: boolean
}

export default {
  props: {
    Component: String,
    style: Object,
    className: String,
    registerInput: {
      type: Object as () => RegisterInput,
      required: true
    },
    opts: Object
  },
  setup({ registerInput, opts }) {
    const taskRef = ref<HTMLLIElement | null>(null)
    let dflexDnD: DnD | null = null
    const { id, depth, readonly } = registerInput

    const isCI = import.meta.env.MODE === 'CI'
    const logColor = isCI ? '\x1b[31m' : '\x1b[32m'
    const logMessage = `Running in ${logColor}${isCI ? 'CI' : 'non-CI'}\x1b[0m environment.`

    console.log(logMessage)

    onMounted(() => {
      if (taskRef.value) {
        store.register({
          id,
          depth,
          readonly,
          animation: isCI ? null : undefined,
          CSSTransform: {
            background: '#ae51ff',
            'box-shadow': '0 0 8px 4px rgba(255, 255, 255, 0.5)',
            opacity: '0.8'
          }
        })
      }
    })

    onUnmounted(() => {
      store.unregister(id)
    })

    const onDFlexEvent = (e: DFlexEvents) => {
      console.log(`onDFlexEvent: ${e.type}`, e.detail)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (dflexDnD) {
        const { clientX, clientY } = e
        dflexDnD.dragAt(clientX, clientY)
      }
    }

    const onPointerUp = () => {
      if (dflexDnD) {
        dflexDnD.endDragging()
        dflexDnD = null

        document.removeEventListener('pointerup', onPointerUp)
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('$onDragLeave', onDFlexEvent)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.stopPropagation()
      const { button, clientX, clientY } = e

      if (typeof button === 'number' && button === 0) {
        if (id) {
          document.addEventListener('pointerup', onPointerUp)
          document.addEventListener('pointermove', onPointerMove)
          dflexDnD = new DnD(id, { x: clientX, y: clientY }, opts)
          document.addEventListener('$onDragLeave', onDFlexEvent)
        }
      }
    }

    return {
      taskRef,
      onPointerDown
    }
  }
}
</script>
