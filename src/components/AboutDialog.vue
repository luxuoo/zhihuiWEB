<script setup>
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal" @click.self="emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <h2>
              <span class="header-icon"><span class="material-symbols-outlined">info</span></span>
              关于
            </h2>
            <button class="modal-close" @click="emit('close')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="brand">
              <div class="brand-icon">
                <span class="material-symbols-outlined">eco</span>
              </div>
              <h1>GreenhouseOS</h1>
              <p class="version">v2.0.0</p>
            </div>
            <p class="desc">智能温室种植系统监控面板，实时监测温湿度、光照、水位、空气质量，支持设备远程控制与视觉识别。</p>
            <div class="info-list">
              <div class="info-row">
                <span class="label">技术栈</span>
                <span class="value">Vue 3 + Vite + ECharts</span>
              </div>
              <div class="info-row">
                <span class="label">后端服务</span>
                <span class="value">FastAPI + MQTT</span>
              </div>
              <div class="info-row">
                <span class="label">通信协议</span>
                <span class="value">HTTP REST + WebSocket</span>
              </div>
              <div class="info-row">
                <span class="label">设备节点</span>
                <span class="value">ESP32 + 传感器模块</span>
              </div>
              <div class="info-row">
                <span class="label">视觉识别</span>
                <span class="value">植物病虫害检测</span>
              </div>
            </div>
            <div class="features">
              <span class="tag">实时监控</span>
              <span class="tag">远程控制</span>
              <span class="tag">历史曲线</span>
              <span class="tag">图像识别</span>
              <span class="tag">告警通知</span>
              <span class="tag">响应式</span>
            </div>
            <p class="copyright">© 2025 智能温室种植系统</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.modal-box {
  background: var(--surface);
  border-radius: var(--r-xl);
  width: 100%; max-width: 420px;
  box-shadow: var(--shadow-lg);
  animation: scaleIn 0.25s ease;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 {
  display: flex; align-items: center; gap: 10px;
  font-size: 17px; font-weight: 600;
}
.header-icon {
  width: 32px; height: 32px; border-radius: var(--r-sm);
  background: rgba(26,109,92,0.06);
  display: flex; align-items: center; justify-content: center;
}
.header-icon .material-symbols-outlined { color: var(--primary); font-size: 18px; }
.modal-close {
  width: 34px; height: 34px;
  border: none; background: var(--surface);
  color: var(--text-2);
  border-radius: var(--r-full);
  cursor: pointer; transition: var(--ease);
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--surface-2); color: var(--text-1); }
.modal-body { padding: 24px; text-align: center; }
.brand { margin-bottom: 20px; }
.brand-icon {
  width: 60px; height: 60px;
  margin: 0 auto 12px;
  border-radius: var(--r-lg);
  background: linear-gradient(135deg, var(--primary), var(--surface-tint));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(26,109,92,0.2);
}
.brand-icon .material-symbols-outlined { font-size: 30px; color: white; }
.brand h1 { font-size: 20px; font-weight: 700; color: var(--text-1); letter-spacing: -0.02em; }
.version {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--text-3);
  margin-top: 4px;
  padding: 2px 8px;
  background: var(--surface);
  border-radius: var(--r-full);
  display: inline-block;
}
.desc {
  font-size: 13px; color: var(--text-2);
  line-height: 1.6; margin-bottom: 20px; text-align: left;
}
.info-list {
  background: var(--surface-2);
  border-radius: var(--r);
  padding: 14px 16px; margin-bottom: 16px;
  text-align: left;
  border: 1px solid var(--border);
}
.info-row {
  display: flex; justify-content: space-between;
  padding: 7px 0; font-size: 12px;
  border-bottom: 1px solid var(--border);
}
.info-row:last-child { border-bottom: none; }
.info-row .label { color: var(--text-2); font-weight: 500; }
.info-row .value { color: var(--text-1); font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.features { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 16px; }
.tag {
  padding: 4px 10px;
  background: rgba(26,109,92,0.06);
  color: var(--primary);
  font-size: 11px; font-weight: 600;
  border-radius: var(--r-full);
  border: 1px solid rgba(26,109,92,0.12);
  transition: var(--ease);
}
.tag:hover { background: rgba(26,109,92,0.1); }
.copyright { font-size: 11px; color: var(--text-3); margin-top: 8px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media(max-width:480px) {
  .modal-box { max-width: 100%; margin: 0; border-radius: var(--r-xl) var(--r-xl) 0 0; }
  .modal { align-items: flex-end; padding: 0; }
}
</style>
