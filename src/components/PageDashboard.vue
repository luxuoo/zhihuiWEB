<script setup>
import { inject, computed, ref, watch } from 'vue'
import { useApi } from '../composables/useApi.js'
import SensorCard from './SensorCard.vue'
import MiniChart from './MiniChart.vue'
import LatestImages from './LatestImages.vue'
import RecentAlarms from './RecentAlarms.vue'

const latest = inject('latest')
const showToast = inject('showToast')
const api = useApi()

const prevData = ref({ temp:0, humi:0, lux:0, water:0, air:0 })

const data = computed(() => {
  if (!latest.value) return { temp:0,humi:0,lux:0,water:0,air:0,light:0,fan:0,mode:'auto',nodes:{n1:0,n2:0},vision:{cls:'healthy',conf:0,pest:0} }
  const d = latest.value
  return {
    temp:parseFloat(d.temp)||0, humi:parseFloat(d.humi)||0, lux:parseFloat(d.lux)||0,
    water:parseFloat(d.water)||0, air:parseInt(d.air)||0,
    light:parseInt(d.light)||0, fan:parseInt(d.fan)||0,
    mode:d.mode||'auto', nodes:d.nodes||{n1:0,n2:0},
    vision:d.vision||{cls:'healthy',conf:0,pest:0}
  }
})

watch(latest, (d) => {
  if (d) {
    prevData.value = {
      temp:parseFloat(d.temp)||0, humi:parseFloat(d.humi)||0,
      lux:parseFloat(d.lux)||0, water:parseFloat(d.water)||0, air:parseInt(d.air)||0
    }
  }
}, { deep: true })

const lastUpdate = computed(() => latest.value?.ts ? new Date(latest.value.ts*1000).toLocaleTimeString('zh-CN') : '--')
const nodeText = computed(() => `N1:${data.value.nodes.n1?'在线':'离线'} N2:${data.value.nodes.n2?'在线':'离线'}`)

const mode = ref('auto')
async function setMode(m) { try { await api.setMode(m); mode.value=m; showToast(`已切换到${m==='auto'?'自动':'手动'}模式`,'success') } catch(e){ showToast('切换失败','error') } }

async function toggleRelay(relay) {
  const newVal = data.value[relay] ? 0 : 1
  const names = {light:'补光灯',fan:'风扇'}
  try { await api.toggleRelay(relay, newVal); showToast(`已发送${names[relay]}${newVal?'开启':'关闭'}指令`,'success') }
  catch(e) { showToast('命令发送失败','error') }
}

const emit = defineEmits(['switchTab'])
</script>

<template>
  <div class="dash">
    <!-- 顶部信息条 -->
    <div class="dash-info">
      <div class="info-item">
        <span class="material-symbols-outlined">dns</span>
        <span>gh01</span>
      </div>
      <div class="info-item">
        <span class="material-symbols-outlined">settings</span>
        <span>{{ data.mode==='auto'?'自动模式':'手动模式' }}</span>
      </div>
      <div class="info-item">
        <span class="material-symbols-outlined">schedule</span>
        <span>{{ lastUpdate }}</span>
      </div>
      <div class="info-item">
        <span class="material-symbols-outlined">device_hub</span>
        <span>{{ nodeText }}</span>
      </div>
    </div>

    <!-- 传感器卡片 -->
    <div class="dash-cards">
      <SensorCard type="temp"  :value="data.temp"  :prev="prevData.temp"  unit="°C" />
      <SensorCard type="humi"  :value="data.humi"  :prev="prevData.humi"  unit="%" />
      <SensorCard type="lux"   :value="data.lux"   :prev="prevData.lux"   unit="Lux" />
      <SensorCard type="water" :value="data.water"  :prev="prevData.water" unit="mm" />
      <SensorCard type="air"   :value="data.air"   :prev="prevData.air"   unit="AQI" />
      <SensorCard type="vision" :value="0" unit="" :vision="data.vision" />
    </div>

    <!-- 设备控制 -->
    <div class="dash-section">
      <div class="section-head">
        <h2>
          <span class="material-symbols-outlined">tune</span>
          设备控制
        </h2>
        <div class="mode-toggle">
          <button class="mode-btn" :class="{active:mode==='auto'}" @click="setMode('auto')">
            <span class="material-symbols-outlined">smart_toy</span>自动
          </button>
          <button class="mode-btn" :class="{active:mode==='manual'}" @click="setMode('manual')">
            <span class="material-symbols-outlined">pan_tool</span>手动
          </button>
        </div>
      </div>
      <div class="device-grid">
        <div v-for="r in [{k:'light',icon:'lightbulb',name:'补光灯',desc:'生长补光'}]" :key="r.k"
          class="device-card" :class="{on: data[r.k]}" @click="toggleRelay(r.k)">
          <div class="dc-icon">
            <span class="material-symbols-outlined">{{ r.icon }}</span>
          </div>
          <div class="dc-body">
            <h3>{{ r.name }}</h3>
            <p>{{ data[r.k] ? '运行中' : '已关闭' }}</p>
          </div>
          <label class="switch" @click.stop>
            <input type="checkbox" :checked="data[r.k]" @change="toggleRelay(r.k)">
            <span class="switch-track"></span>
          </label>
        </div>
        <div v-for="r in [{k:'fan',icon:'mode_fan',name:'风扇',desc:'通风降温'}]" :key="r.k"
          class="device-card" :class="{on: data[r.k]}" @click="toggleRelay(r.k)">
          <div class="dc-icon">
            <span class="material-symbols-outlined">{{ r.icon }}</span>
          </div>
          <div class="dc-body">
            <h3>{{ r.name }}</h3>
            <p>{{ data[r.k] ? '运行中' : '已关闭' }}</p>
          </div>
          <label class="switch" @click.stop>
            <input type="checkbox" :checked="data[r.k]" @change="toggleRelay(r.k)">
            <span class="switch-track"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 趋势图 -->
    <MiniChart @view-all="emit('switchTab', 'history')" />

    <!-- 底部两栏 -->
    <div class="dash-row">
      <LatestImages @view-all="emit('switchTab', 'camera')" />
      <RecentAlarms @view-all="emit('switchTab', 'alarm')" />
    </div>

    <footer class="dash-footer">
      <span>© 2025 智能温室种植系统</span>
      <span><span class="material-symbols-outlined">sync</span>每 5 秒自动刷新</span>
    </footer>
  </div>
</template>

<style scoped>
.dash {
  animation: fadeUp 0.35s ease;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* 信息条 */
.dash-info {
  display: flex; gap: 8px; flex-wrap: wrap;
  margin-bottom: 20px;
}
.info-item {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  font-size: 12px; font-weight: 500; color: var(--text-2);
  font-family: 'JetBrains Mono', monospace;
}
.info-item .material-symbols-outlined { font-size: 14px; color: var(--primary); }

/* 卡片网格 */
.dash-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

/* 区块 */
.dash-section {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.section-head h2 {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: var(--text-1);
}
.section-head h2 .material-symbols-outlined { font-size: 18px; color: var(--primary); }

/* 模式切换 */
.mode-toggle {
  display: flex; gap: 2px;
  background: var(--surface-2);
  padding: 3px; border-radius: var(--r);
}
.mode-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 14px;
  border: none; background: transparent;
  color: var(--text-2);
  font-size: 12px; font-weight: 500;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mode-btn:hover { color: var(--text-1); }
.mode-btn.active {
  color: white;
  background: var(--primary);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(11,138,111,0.25);
}
.mode-btn .material-symbols-outlined { font-size: 15px; }

/* 设备卡片 */
.device-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.device-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border-radius: var(--r);
  border: 1px solid var(--border);
  background: var(--surface-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.device-card:hover { border-color: var(--surface-3); }
.device-card.on {
  border-color: var(--primary);
  background: var(--primary-50);
}
.dc-icon {
  width: 42px; height: 42px;
  border-radius: var(--r);
  background: var(--surface-3);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  transition: all 0.15s ease;
}
.device-card.on .dc-icon {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 10px rgba(11,138,111,0.25);
}
.dc-icon .material-symbols-outlined { font-size: 20px; }
.dc-body { flex: 1; }
.dc-body h3 { font-size: 13px; font-weight: 700; color: var(--text-1); margin-bottom: 2px; }
.dc-body p { font-size: 11px; color: var(--text-2); }
.device-card.on .dc-body p { color: var(--primary); font-weight: 600; }

/* 开关 */
.switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch-track {
  position: absolute; cursor: pointer;
  inset: 0;
  background: var(--surface-3);
  border-radius: 11px;
  transition: all 0.2s ease;
}
.switch-track::before {
  content: "";
  position: absolute;
  height: 16px; width: 16px;
  left: 3px; bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.switch input:checked + .switch-track { background: var(--primary); }
.switch input:checked + .switch-track::before { transform: translateX(18px); }

/* 底部行 */
.dash-row { display: flex; gap: 14px; margin-bottom: 20px; }

/* 页脚 */
.dash-footer {
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 11px; color: var(--text-3);
}
.dash-footer span:last-child {
  display: flex; align-items: center; gap: 3px;
  font-family: 'JetBrains Mono', monospace;
}
.dash-footer .material-symbols-outlined { font-size: 13px; }

@media (max-width: 1200px) {
  .dash-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .dash-cards { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px; }
  .device-grid { grid-template-columns: 1fr; }
  .dash-info { gap: 6px; margin-bottom: 14px; }
  .info-item { padding: 5px 10px; font-size: 11px; }
  .dash-section { padding: 14px; margin-bottom: 14px; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 10px; }
  .dash-row { flex-direction: column; }
  .dash-footer { flex-direction: column; gap: 4px; text-align: center; }
}
@media (max-width: 380px) { .dash-cards { grid-template-columns: 1fr; } }
</style>
