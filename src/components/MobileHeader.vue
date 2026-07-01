<script setup>
const emit = defineEmits(['openAlarm'])
</script>

<template>
  <header class="m-header">
    <div class="m-brand">
      <span class="material-symbols-outlined">eco</span>
      <h1>Greenhouse</h1>
    </div>
    <button class="icon-btn" @click="emit('openAlarm')">
      <span class="material-symbols-outlined">notifications</span>
    </button>
  </header>
</template>

<style scoped>
.m-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 50px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 10;
}
.m-brand {
  display: flex; align-items: center; gap: 8px;
}
.m-brand .material-symbols-outlined { font-size: 20px; color: var(--primary); }
.m-brand h1 { font-size: 15px; font-weight: 700; color: var(--text-1); }
.icon-btn {
  width: 36px; height: 36px;
  border: none; background: transparent;
  color: var(--text-2);
  border-radius: var(--r);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.icon-btn:hover { background: var(--surface-2); }
.icon-btn .material-symbols-outlined { font-size: 20px; }
@media (max-width: 768px) { .m-header { display: flex; } }
</style>
