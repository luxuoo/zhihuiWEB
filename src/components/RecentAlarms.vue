<script setup>
import { ref, computed, inject, watch } from 'vue'
import { ALARM_TYPES, DEFAULT_THRESHOLDS } from '../config.js'

const emit = defineEmits(['viewAll'])
const latest = inject('latest')
const alarms = ref([])

watch(latest, (d) => {
  if (!d) return
  const now = Math.floor(Date.now() / 1000)
  function fire(type, msg) {
    if (alarms.value.some(a => a.type === type && now - a.ts < 120)) return
    alarms.value.unshift({ type, ts: now, message: msg })
    if (alarms.value.length > 50) alarms.value.pop()
  }
  const temp = parseFloat(d.temp) || 0, humi = parseFloat(d.humi) || 0
  const lux = parseFloat(d.lux) || 0, water = parseFloat(d.water) || 0, air = parseInt(d.air) || 0
  if (temp > DEFAULT_THRESHOLDS.TH_TEMP) fire('temp_high', `温度 ${temp.toFixed(1)}°C 超过阈值`)
  if (humi > DEFAULT_THRESHOLDS.TH_HUMI) fire('humi_high', `湿度 ${humi.toFixed(0)}% 超过阈值`)
  if (lux < DEFAULT_THRESHOLDS.TH_LUX) fire('lux_low', `光照 ${lux} Lux 低于阈值`)
  if (water < DEFAULT_THRESHOLDS.TH_WATER_LOW) fire('water_low', `水位 ${water}mm 低于下限`)
  if (air > 150) fire('air_poor', `AQI ${air} 空气质量差`)
}, { deep: true })

const recent = computed(() => alarms.value.slice(0, 5))
</script>

<template>
  <div class="ra">
    <div class="ra-head">
      <h3>
        <span class="ra-badge"><span class="material-symbols-outlined">notifications_active</span></span>
        最近告警
      </h3>
      <button class="ra-link" @click="emit('viewAll')">
        查看全部
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
    <div v-if="recent.length === 0" class="ra-empty">
      <div class="ra-empty-icon"><span class="material-symbols-outlined">check_circle</span></div>
      <p>系统正常，暂无告警</p>
    </div>
    <div v-else class="ra-list">
      <div v-for="a in recent" :key="a.ts + a.type" class="ra-item" :class="ALARM_TYPES[a.type]?.level || 'info'">
        <div class="ra-icon">
          <span class="material-symbols-outlined">{{ ALARM_TYPES[a.type]?.icon || 'notifications' }}</span>
        </div>
        <div class="ra-body">
          <span class="ra-title">{{ ALARM_TYPES[a.type]?.title || a.type }}</span>
          <span class="ra-msg">{{ a.message }}</span>
        </div>
        <span class="ra-time">{{ new Date(a.ts * 1000).toLocaleTimeString('zh-CN') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ra {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  flex: 1; min-width: 0;
}
.ra-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.ra-head h3 {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: var(--text-1);
}
.ra-badge {
  width: 28px; height: 28px; border-radius: var(--r);
  background: var(--amber-50);
  display: flex; align-items: center; justify-content: center;
}
.ra-badge .material-symbols-outlined { color: var(--amber); font-size: 17px; }
.ra-link {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: var(--blue);
  background: transparent; border: none;
  cursor: pointer;
  padding: 5px 10px; border-radius: var(--r-sm);
}
.ra-link:hover { background: var(--blue-50); }
.ra-link .material-symbols-outlined { font-size: 15px; transition: transform 0.2s ease; }
.ra-link:hover .material-symbols-outlined { transform: translateX(2px); }

.ra-empty { text-align: center; padding: 28px; }
.ra-empty-icon {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--primary-50);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.ra-empty-icon .material-symbols-outlined { font-size: 22px; color: var(--primary); }
.ra-empty p { font-size: 13px; color: var(--text-2); }

.ra-list { display: flex; flex-direction: column; gap: 6px; }
.ra-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--r);
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
  transition: all 0.15s ease;
}
.ra-item:hover { background: var(--surface-2); }
.ra-item.danger { border-left-color: var(--error); }
.ra-item.warning { border-left-color: var(--warning); }
.ra-item.info { border-left-color: var(--blue); }

.ra-icon {
  width: 28px; height: 28px; border-radius: var(--r);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ra-icon .material-symbols-outlined { font-size: 16px; }
.ra-item.danger .ra-icon { background: rgba(239,68,68,0.08); color: var(--error); }
.ra-item.warning .ra-icon { background: var(--amber-50); color: var(--warning); }
.ra-item.info .ra-icon { background: var(--blue-50); color: var(--blue); }

.ra-body { flex: 1; min-width: 0; }
.ra-title { display: block; font-size: 12px; font-weight: 600; color: var(--text-1); }
.ra-msg { display: block; font-size: 11px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ra-time { font-size: 10px; color: var(--text-3); font-family: 'JetBrains Mono', monospace; white-space: nowrap; flex-shrink: 0; }
</style>
