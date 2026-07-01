<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['refresh'])
const time = ref('')
let t = null
function tick() { time.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
onMounted(() => { tick(); t = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(t))
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <h2>监控面板</h2>
      <span class="status-badge">
        <span class="status-dot"></span>
        在线
      </span>
    </div>
    <div class="topbar-right">
      <button class="icon-btn" title="刷新" @click="emit('refresh')">
        <span class="material-symbols-outlined">refresh</span>
      </button>
      <span class="clock">{{ time }}</span>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  height: 54px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  z-index: 10;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-left h2 {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}
.status-badge {
  display: flex; align-items: center; gap: 5px;
  padding: 3px 10px;
  background: rgba(16,185,129,0.08);
  color: var(--success);
  font-size: 11px; font-weight: 600;
  border-radius: var(--r-full);
  border: 1px solid rgba(16,185,129,0.15);
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px rgba(16,185,129,0.4);
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-btn {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  background: transparent;
  border: none;
  border-radius: var(--r);
  cursor: pointer;
  transition: var(--ease);
}
.icon-btn:hover { background: var(--surface-2); color: var(--text-1); }
.icon-btn .material-symbols-outlined { font-size: 19px; }
.clock {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-3);
  font-weight: 500;
  padding: 4px 10px;
  background: var(--surface-2);
  border-radius: var(--r-sm);
}
@media(max-width:768px) { .topbar { display: none; } }
</style>
