<script setup>
import { computed, ref, watch } from 'vue'
import { METRICS, AIR_LEVELS, VISION_CLASSES } from '../config.js'

const props = defineProps({
  type: String,
  value: [Number, String],
  prev: [Number, String],
  unit: String,
  vision: Object,
})

const sparkData = ref([])

watch(() => props.value, (v) => {
  if (['temp','humi','lux','water'].includes(props.type)) {
    sparkData.value.push(Number(v))
    if (sparkData.value.length > 20) sparkData.value.shift()
  }
}, { immediate: true })

const metric = computed(() => METRICS[props.type])
const pct = computed(() => {
  const m = metric.value
  if (!m) return 0
  return Math.min(100, Math.max(0, ((Number(props.value) - m.min) / (m.max - m.min)) * 100))
})

const trend = computed(() => {
  const cur = Number(props.value), pre = Number(props.prev)
  if (isNaN(cur) || isNaN(pre)) return { cls: '', icon: 'remove', text: '--' }
  const d = cur - pre
  if (d > 0.5) return { cls: 'up', icon: 'arrow_upward', text: '上升' }
  if (d < -0.5) return { cls: 'down', icon: 'arrow_downward', text: '下降' }
  return { cls: 'stable', icon: 'remove', text: '稳定' }
})

const airLevel = computed(() => {
  if (props.type !== 'air') return null
  return AIR_LEVELS.find(l => Number(props.value) >= l.min && Number(props.value) <= l.max)
})

const visionLabel = computed(() => {
  if (props.type !== 'vision' || !props.vision) return '--'
  return VISION_CLASSES[props.vision.cls] || props.vision.cls
})

const sparkPath = computed(() => {
  const d = sparkData.value
  if (d.length < 2) return ''
  const min = Math.min(...d), max = Math.max(...d), range = max - min || 1
  const w = 100, h = 32, step = w / (d.length - 1)
  let p = `M0,${h - ((d[0]-min)/range)*h}`
  for (let i = 1; i < d.length; i++) p += ` L${(i*step).toFixed(1)},${(h-((d[i]-min)/range)*h).toFixed(1)}`
  return p
})

const colorMap = {
  temp: '#0B8A6F',
  humi: '#3B82F6',
  lux: '#F59E0B',
  water: '#3B82F6',
  air: '#0B8A6F',
  vision: '#8B5CF6'
}
const iconMap = { temp:'thermostat', humi:'water_drop', lux:'sunny', water:'water', air:'air', vision:'visibility' }
</script>

<template>
  <div class="sc" :class="type">
    <div class="sc-accent" :style="{ background: colorMap[type] }"></div>
    <div class="sc-inner">
      <div class="sc-head">
        <div class="sc-label">
          <span class="sc-dot" :style="{ background: colorMap[type] }"></span>
          {{ metric?.name || '视觉识别' }}
        </div>
        <span v-if="type !== 'vision'" class="sc-trend" :class="trend.cls">
          <span class="material-symbols-outlined">{{ trend.icon }}</span>
        </span>
      </div>

      <!-- 空气质量 -->
      <template v-if="type==='air'">
        <div class="sc-val-row">
          <span class="sc-val">{{ value }}</span>
          <span class="sc-unit">{{ unit }}</span>
        </div>
        <span class="sc-badge" :class="airLevel?.cls">{{ airLevel?.label || '--' }}</span>
      </template>

      <!-- 视觉识别 -->
      <template v-else-if="type==='vision'">
        <div class="sc-val-row">
          <span class="sc-val sm">{{ visionLabel }}</span>
        </div>
        <div class="sc-conf">
          <div class="sc-conf-bar"><div class="sc-conf-fill" :style="{width:(vision?.conf||0)*100+'%', background: colorMap[type]}"></div></div>
          <span class="sc-conf-text">{{ ((vision?.conf||0)*100).toFixed(0) }}%</span>
        </div>
      </template>

      <!-- 普通数值 -->
      <template v-else>
        <div class="sc-val-row">
          <span class="sc-val">{{ value }}</span>
          <span class="sc-unit">{{ unit }}</span>
        </div>
        <div class="sc-bar">
          <div class="sc-bar-track">
            <div class="sc-bar-fill" :style="{width: pct+'%', background: colorMap[type]}"></div>
          </div>
        </div>
      </template>

      <!-- 趋势线 -->
      <svg v-if="sparkPath" class="sc-spark" viewBox="0 0 100 32" preserveAspectRatio="none">
        <path :d="sparkPath" fill="none" :stroke="colorMap[type]" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity="0.35"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.sc {
  background: var(--surface);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
}
.sc:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.sc-accent {
  width: 3px;
  flex-shrink: 0;
  border-radius: 3px 0 0 3px;
}
.sc-inner {
  flex: 1;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  min-height: 125px;
}

.sc-head {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
}
.sc-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600; color: var(--text-2);
  text-transform: uppercase; letter-spacing: 0.04em;
}
.sc-dot {
  width: 6px; height: 6px; border-radius: 50%;
}
.sc-trend {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 50%;
}
.sc-trend .material-symbols-outlined { font-size: 13px; }
.sc-trend.up { color: var(--error); background: rgba(239,68,68,0.08); }
.sc-trend.down { color: var(--blue); background: var(--blue-50); }
.sc-trend.stable { color: var(--text-3); }

.sc-val-row {
  display: flex; align-items: baseline; gap: 4px;
  margin-bottom: 10px;
}
.sc-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px; font-weight: 700;
  color: var(--text-1); line-height: 1;
  letter-spacing: -0.03em;
}
.sc-val.sm { font-size: 18px; font-family: inherit; font-weight: 700; }
.sc-unit {
  font-size: 13px; color: var(--text-3);
  font-family: 'JetBrains Mono', monospace; font-weight: 500;
}

/* 进度条 */
.sc-bar { margin-top: auto; }
.sc-bar-track {
  height: 4px; background: var(--surface-2);
  border-radius: 2px; overflow: hidden;
}
.sc-bar-fill {
  height: 100%; border-radius: 2px;
  transition: width 0.6s ease;
}

/* 空气质量 */
.sc-badge {
  display: inline-block;
  padding: 3px 10px; border-radius: var(--r-full);
  font-size: 11px; font-weight: 600;
  margin-top: auto;
}
.sc-badge.good { background: rgba(16,185,129,0.08); color: var(--success); }
.sc-badge.moderate { background: var(--amber-100); color: #92400E; }
.sc-badge.poor { background: rgba(239,68,68,0.08); color: var(--error); }

/* 置信度 */
.sc-conf { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.sc-conf-bar { flex: 1; height: 4px; background: var(--surface-2); border-radius: 2px; overflow: hidden; }
.sc-conf-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.sc-conf-text { font-size: 11px; color: var(--text-3); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }

/* 趋势线 */
.sc-spark {
  position: absolute; bottom: 0; left: 3px; right: 0;
  width: calc(100% - 3px); height: 32px;
  pointer-events: none;
}

@media (max-width: 768px) {
  .sc-inner { padding: 14px 14px; min-height: 110px; }
  .sc-val { font-size: 26px; }
  .sc-val.sm { font-size: 16px; }
  .sc-unit { font-size: 11px; }
  .sc-label { font-size: 10px; }
  .sc-spark { height: 24px; }
}
</style>
