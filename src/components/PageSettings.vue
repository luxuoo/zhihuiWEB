<script setup>
import { ref, inject } from 'vue'
import { API_BASE, DEVICE_ID, REFRESH_INTERVAL, DEFAULT_THRESHOLDS } from '../config.js'

const emit = defineEmits(['close'])
const showToast = inject('showToast')

const settings = ref({
  apiBase: API_BASE,
  deviceId: DEVICE_ID,
  refreshInterval: REFRESH_INTERVAL / 1000,
  ...DEFAULT_THRESHOLDS,
})

function save() {
  localStorage.setItem('gh_settings', JSON.stringify(settings.value))
  showToast('设置已保存，部分设置需刷新页面生效', 'success')
  emit('close')
}

const saved = localStorage.getItem('gh_settings')
if (saved) {
  try { Object.assign(settings.value, JSON.parse(saved)) } catch (e) {}
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal" @click.self="emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <h2>
              <span class="header-icon"><span class="material-symbols-outlined">settings</span></span>
              系统设置
            </h2>
            <button class="modal-close" @click="emit('close')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="section">
              <h3>
                <span class="material-symbols-outlined">cable</span>连接配置
              </h3>
              <div class="field">
                <label>API 地址</label>
                <input v-model="settings.apiBase" type="text" placeholder="http://ip:port/api">
              </div>
              <div class="field">
                <label>设备 ID</label>
                <input v-model="settings.deviceId" type="text" placeholder="gh01">
              </div>
              <div class="field">
                <label>刷新间隔 (秒)</label>
                <input v-model.number="settings.refreshInterval" type="number" min="1" max="60">
              </div>
            </div>
            <div class="section">
              <h3>
                <span class="material-symbols-outlined">tune</span>告警阈值
              </h3>
              <div class="fields-grid">
                <div class="field">
                  <label><span class="material-symbols-outlined">thermostat</span>温度上限 °C</label>
                  <input v-model.number="settings.TH_TEMP" type="number" min="0" max="50">
                </div>
                <div class="field">
                  <label><span class="material-symbols-outlined">water_drop</span>湿度上限 %</label>
                  <input v-model.number="settings.TH_HUMI" type="number" min="0" max="100">
                </div>
                <div class="field">
                  <label><span class="material-symbols-outlined">sunny</span>光照下限 Lux</label>
                  <input v-model.number="settings.TH_LUX" type="number" min="0" max="2000">
                </div>
                <div class="field">
                  <label><span class="material-symbols-outlined">water</span>水位下限 mm</label>
                  <input v-model.number="settings.TH_WATER_LOW" type="number" min="0" max="2000">
                </div>
                <div class="field">
                  <label><span class="material-symbols-outlined">water</span>水位上限 mm</label>
                  <input v-model.number="settings.TH_WATER_HIGH" type="number" min="0" max="2000">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="emit('close')">取消</button>
            <button class="btn-save" @click="save">
              <span class="material-symbols-outlined">save</span>保存设置
            </button>
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
  width: 100%; max-width: 500px;
  max-height: 90vh; overflow: auto;
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
.modal-body { padding: 24px; }
.section { margin-bottom: 24px; }
.section:last-child { margin-bottom: 0; }
.section h3 {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 600; color: var(--text-1);
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.section h3 .material-symbols-outlined { font-size: 17px; color: var(--primary); }
.field { margin-bottom: 14px; }
.field:last-child { margin-bottom: 0; }
.field label {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600; color: var(--text-2);
  margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em;
}
.field label .material-symbols-outlined { font-size: 15px; color: var(--primary); }
.field input {
  width: 100%; padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-size: 13px; color: var(--text-1);
  background: var(--surface-2);
  outline: none; transition: var(--ease);
}
.field input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(26,109,92,0.08);
  background: var(--surface);
}
.fields-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
.btn-cancel {
  padding: 9px 18px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  border-radius: var(--r-sm);
  font-size: 13px; font-weight: 500;
  cursor: pointer; transition: var(--ease);
}
.btn-cancel:hover { background: var(--surface-2); border-color: var(--border); }
.btn-save {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: var(--primary);
  color: var(--text-inv);
  border: none; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: var(--ease);
  box-shadow: 0 2px 6px rgba(26,109,92,0.2);
}
.btn-save:hover {
  background: var(--primary-dark);
  box-shadow: 0 4px 10px rgba(26,109,92,0.25);
  transform: translateY(-1px);
}
.btn-save .material-symbols-outlined { font-size: 17px; }

/* 过渡动画 */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media(max-width:480px) {
  .modal-box { max-width: 100%; margin: 0; border-radius: var(--r-xl) var(--r-xl) 0 0; max-height: 85vh; }
  .modal { align-items: flex-end; padding: 0; }
  .fields-grid { grid-template-columns: 1fr; }
}
</style>
