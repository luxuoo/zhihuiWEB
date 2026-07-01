<script setup>
const tab = defineModel('tab')
const emit = defineEmits(['emergency', 'settings', 'about'])
const tabs = [
  { k:'dashboard', icon:'dashboard',     label:'实时监控' },
  { k:'history',   icon:'show_chart',    label:'历史数据' },
  { k:'camera',    icon:'photo_library', label:'图像监控' },
  { k:'alarm',     icon:'notifications', label:'告警记录' },
]
</script>

<template>
  <nav class="sidebar">
    <div class="sb-brand">
      <div class="sb-logo"><span class="material-symbols-outlined">eco</span></div>
      <div class="sb-brand-text">
        <h1>Greenhouse</h1>
        <span class="sb-ver">v2.0</span>
      </div>
    </div>

    <div class="sb-device">
      <div class="sb-device-dot"></div>
      <div>
        <p class="sb-device-name">温室 Alpha</p>
        <p class="sb-device-status">在线运行中</p>
      </div>
    </div>

    <div class="sb-nav">
      <button v-for="t in tabs" :key="t.k"
        class="sb-nav-item" :class="{ active: tab === t.k }"
        @click="tab = t.k">
        <span class="material-symbols-outlined">{{ t.icon }}</span>
        <span class="sb-nav-label">{{ t.label }}</span>
        <span v-if="tab === t.k" class="sb-nav-indicator"></span>
      </button>
    </div>

    <div class="sb-bottom">
      <button class="sb-nav-item" @click="emit('settings')">
        <span class="material-symbols-outlined">settings</span>
        <span class="sb-nav-label">系统设置</span>
      </button>
      <button class="sb-nav-item" @click="emit('about')">
        <span class="material-symbols-outlined">info</span>
        <span class="sb-nav-label">关于</span>
      </button>
    </div>

    <button class="sb-emergency" @click="emit('emergency')">
      <span class="material-symbols-outlined">power_settings_new</span>
      紧急停止
    </button>
  </nav>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  padding: 20px 14px 16px;
  flex-shrink: 0;
  z-index: 20;
}

/* 品牌 */
.sb-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  margin-bottom: 20px;
}
.sb-logo {
  width: 38px; height: 38px;
  border-radius: var(--r);
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(11,138,111,0.3);
}
.sb-logo .material-symbols-outlined { font-size: 20px; color: white; }
.sb-brand-text h1 { font-size: 15px; font-weight: 700; color: var(--sidebar-text-active); line-height: 1.2; }
.sb-ver { font-size: 10px; color: var(--sidebar-text); font-family: 'JetBrains Mono', monospace; }

/* 设备状态 */
.sb-device {
  display: flex; align-items: center; gap: 10px;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border-radius: var(--r);
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.06);
}
.sb-device-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 8px rgba(16,185,129,0.5);
  flex-shrink: 0;
}
.sb-device-name { font-size: 12px; font-weight: 600; color: var(--sidebar-text-active); line-height: 1.3; }
.sb-device-status { font-size: 10px; color: var(--success); font-weight: 500; }

/* 导航 */
.sb-nav {
  display: flex; flex-direction: column; gap: 2px;
  flex: 1;
}
.sb-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  color: var(--sidebar-text);
  font-size: 13px; font-weight: 500;
  border-radius: var(--r);
  cursor: pointer;
  border: none; background: transparent;
  width: 100%; text-align: left;
  position: relative;
  transition: all 0.15s ease;
}
.sb-nav-item:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-text-active);
}
.sb-nav-item.active {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
  font-weight: 600;
}
.sb-nav-item .material-symbols-outlined {
  font-size: 20px;
  transition: all 0.15s ease;
}
.sb-nav-item.active .material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
  color: var(--primary-light);
}
.sb-nav-indicator {
  position: absolute;
  right: 0; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 20px;
  border-radius: 3px;
  background: var(--primary-light);
}
.sb-nav-label { white-space: nowrap; }

/* 底部链接 */
.sb-bottom {
  display: flex; flex-direction: column; gap: 2px;
  padding: 12px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: auto;
}

/* 紧急停止 */
.sb-emergency {
  width: 100%;
  padding: 10px;
  background: rgba(239,68,68,0.12);
  color: #FCA5A5;
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--r);
  font-size: 12px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sb-emergency:hover {
  background: rgba(239,68,68,0.2);
  color: #FECACA;
}
.sb-emergency .material-symbols-outlined { font-size: 17px; }

@media(max-width:768px) { .sidebar { display: none; } }
</style>
