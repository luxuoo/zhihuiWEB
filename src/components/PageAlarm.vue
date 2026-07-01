<script setup>
import { ref, computed, inject, watch } from 'vue'
import { DEFAULT_THRESHOLDS, ALARM_TYPES } from '../config.js'

const latest = inject('latest')
const filter = ref('all')
const alarms = ref([])

watch(latest, (d) => {
  if (!d) return
  const now = Math.floor(Date.now()/1000)
  function fire(type, msg) {
    if (alarms.value.some(a => a.type===type && now-a.ts<120)) return
    alarms.value.unshift({type, ts:now, message:msg})
    if (alarms.value.length>100) alarms.value.pop()
  }
  const temp=parseFloat(d.temp)||0, humi=parseFloat(d.humi)||0, lux=parseFloat(d.lux)||0, water=parseFloat(d.water)||0, air=parseInt(d.air)||0
  if(temp>DEFAULT_THRESHOLDS.TH_TEMP) fire('temp_high',`温度 ${temp.toFixed(1)}°C 超过阈值`)
  if(humi>DEFAULT_THRESHOLDS.TH_HUMI) fire('humi_high',`湿度 ${humi.toFixed(0)}% 超过阈值`)
  if(lux<DEFAULT_THRESHOLDS.TH_LUX) fire('lux_low',`光照 ${lux} Lux 低于阈值`)
  if(water<DEFAULT_THRESHOLDS.TH_WATER_LOW) fire('water_low',`水位 ${water}mm 低于下限`)
  if(air>150) fire('air_poor',`AQI ${air} 空气质量差`)
}, { deep: true })

const filtered = computed(() => {
  if (filter.value==='all') return alarms.value
  return alarms.value.filter(a => ALARM_TYPES[a.type]?.level === filter.value)
})

const filters = [{k:'all',l:'全部'},{k:'danger',l:'严重'},{k:'warning',l:'警告'},{k:'info',l:'提示'}]
</script>

<template>
  <div class="page-enter">
    <div class="alarm-header">
      <h2>
        <span class="header-icon"><span class="material-symbols-outlined">notifications_active</span></span>
        告警记录
        <span v-if="alarms.length" class="alarm-count">{{ alarms.length }}</span>
      </h2>
      <div class="alarm-filters">
        <button v-for="f in filters" :key="f.k" class="filter-btn" :class="{active:filter===f.k}" @click="filter=f.k">{{ f.l }}</button>
      </div>
    </div>

    <div v-if="filtered.length===0" class="empty">
      <div class="empty-icon">
        <span class="material-symbols-outlined">check_circle</span>
      </div>
      <p class="empty-title">暂无告警记录</p>
      <p class="hint">系统运行正常，所有指标在安全范围内</p>
    </div>

    <TransitionGroup v-else name="alarm" tag="div" class="alarm-list">
      <div v-for="a in filtered" :key="a.ts+a.type" class="alarm-item" :class="ALARM_TYPES[a.type]?.level||'info'">
        <div class="alarm-icon">
          <span class="material-symbols-outlined">{{ ALARM_TYPES[a.type]?.icon||'notifications' }}</span>
        </div>
        <div class="alarm-content">
          <div class="alarm-title">{{ ALARM_TYPES[a.type]?.title||a.type }}</div>
          <div class="alarm-desc">{{ a.message }}</div>
        </div>
        <div class="alarm-time">{{ new Date(a.ts*1000).toLocaleString('zh-CN') }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.page-enter { animation: fadeInUp 0.4s ease; }
@keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

.alarm-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px; flex-wrap: wrap; gap: 12px;
}
.alarm-header h2 {
  display: flex; align-items: center; gap: 10px;
  font-size: 17px; font-weight: 600;
}
.header-icon {
  width: 32px; height: 32px; border-radius: var(--r-sm);
  background: var(--amber-100);
  display: flex; align-items: center; justify-content: center;
}
.header-icon .material-symbols-outlined { color: var(--warning); font-size: 19px; }
.alarm-count {
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: var(--r-full);
  background: var(--amber-100);
  color: var(--warning);
  font-family: 'JetBrains Mono', monospace;
}

.alarm-filters {
  display: flex; gap: 2px;
  background: var(--surface);
  padding: 3px; border-radius: var(--r-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.filter-btn {
  padding: 6px 14px;
  border: none; background: transparent;
  color: var(--text-2);
  font-size: 12px; font-weight: 500;
  border-radius: var(--r-full);
  cursor: pointer; transition: var(--ease);
}
.filter-btn:hover { background: var(--surface-2); }
.filter-btn.active {
  color: var(--primary);
  background: var(--primary-50);
  font-weight: 600;
}

/* 空状态 */
.empty {
  text-align: center; padding: 60px 40px;
  background: var(--surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.empty-icon {
  width: 64px; height: 64px; border-radius: var(--r-full);
  background: var(--primary-50);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.empty-icon .material-symbols-outlined { font-size: 32px; color: var(--primary); }
.empty-title { color: var(--text-1); font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.hint { font-size: 12px; color: var(--text-3); }

/* 告警列表 */
.alarm-list { display: flex; flex-direction: column; gap: 8px; }
.alarm-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  border-left-width: 3px;
  transition: var(--ease);
}
.alarm-item:hover { box-shadow: var(--shadow-md); transform: translateX(2px); }
.alarm-item.danger { border-left-color: var(--error); }
.alarm-item.warning { border-left-color: var(--warning); }
.alarm-item.info { border-left-color: var(--blue); }

.alarm-icon {
  width: 36px; height: 36px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.alarm-icon .material-symbols-outlined { font-size: 19px; }
.alarm-item.danger .alarm-icon { background: rgba(239,68,68,0.08); color: var(--error); }
.alarm-item.warning .alarm-icon { background: var(--amber-50); color: var(--warning); }
.alarm-item.info .alarm-icon { background: var(--blue-50); color: var(--blue); }

.alarm-content { flex: 1; min-width: 0; }
.alarm-title { font-size: 13px; font-weight: 600; color: var(--text-1); margin-bottom: 2px; }
.alarm-desc { font-size: 12px; color: var(--text-2); }

.alarm-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--text-3);
  white-space: nowrap; flex-shrink: 0;
}

/* 列表动画 */
.alarm-enter-from { opacity: 0; transform: translateX(-20px); }
.alarm-leave-to { opacity: 0; transform: translateX(20px); }
.alarm-move { transition: all 0.3s ease; }

@media(max-width:768px) {
  .alarm-header { flex-direction: column; align-items: stretch; gap: 10px; margin-bottom: 14px; }
  .alarm-header h2 { font-size: 15px; }
  .alarm-filters { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .alarm-filters::-webkit-scrollbar { display: none; }
  .filter-btn { padding: 6px 12px; font-size: 11px; white-space: nowrap; }
  .alarm-item { padding: 12px; gap: 10px; }
  .alarm-icon { width: 32px; height: 32px; }
  .alarm-icon .material-symbols-outlined { font-size: 17px; }
  .alarm-title { font-size: 12px; }
  .alarm-desc { font-size: 11px; }
  .alarm-time { font-size: 10px; }
  .empty { padding: 40px; }
  .empty-icon { width: 52px; height: 52px; }
  .empty-icon .material-symbols-outlined { font-size: 26px; }
}
</style>
