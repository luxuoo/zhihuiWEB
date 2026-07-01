import { reactive } from 'vue'
import { TOAST_DURATION } from '../config.js'

const toasts = reactive([])
let nextId = 0

export function useToast() {
  function show(message, type = 'info') {
    const id = nextId++
    toasts.push({ id, message, type })
    setTimeout(() => {
      const idx = toasts.findIndex(t => t.id === id)
      if (idx !== -1) toasts.splice(idx, 1)
    }, TOAST_DURATION)
  }

  return { toasts, show }
}
