<script setup>
defineProps({ toasts: Array })
const icons = { success:'check_circle', error:'error', warning:'warning', info:'info' }
</script>
<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
        <div class="toast-icon-wrap">
          <span class="material-symbols-outlined icon">{{ icons[t.type] }}</span>
        </div>
        <span class="msg">{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
<style scoped>
.toast-container {
  position: fixed; top: 72px; right: 20px;
  z-index: 1100;
  display: flex; flex-direction: column; gap: 8px;
}
.toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: var(--surface);
  border-radius: var(--r);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  min-width: 260px; max-width: 380px;
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
.toast.success { border-left-color: var(--primary); }
.toast.error { border-left-color: var(--error); }
.toast.warning { border-left-color: var(--warning); }
.toast.info { border-left-color: var(--blue); }

.toast-icon-wrap {
  width: 28px; height: 28px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.icon { font-size: 18px; flex-shrink: 0; }
.success .toast-icon-wrap { background: rgba(26,109,92,0.06); }
.success .icon { color: var(--primary); }
.error .toast-icon-wrap { background: #FEE2E2; }
.error .icon { color: var(--error); }
.warning .toast-icon-wrap { background: #FEF3C7; }
.warning .icon { color: var(--warning); }
.info .toast-icon-wrap { background: #DBEAFE; }
.info .icon { color: var(--blue); }

.msg { font-size: 13px; color: var(--text-1); line-height: 1.4; font-weight: 500; }

.toast-enter-from { opacity: 0; transform: translateX(60px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateX(60px) scale(0.95); }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.2s ease; }

@media(max-width:768px) {
  .toast-container { top: 8px; right: 8px; left: 8px; }
  .toast { min-width: auto; max-width: none; }
}
</style>
