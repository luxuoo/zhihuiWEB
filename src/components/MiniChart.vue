<script setup>
import { ref, inject, watch, onMounted, nextTick, shallowRef } from 'vue'
import { METRICS } from '../config.js'
import * as echarts from 'echarts'

const emit = defineEmits(['viewAll'])
const history = inject('history')
const chartEl = ref(null)
const chart = shallowRef(null)

onMounted(() => {
  nextTick(() => {
    if (chartEl.value) {
      chart.value = echarts.init(chartEl.value)
      window.addEventListener('resize', () => chart.value?.resize())
      renderChart()
    }
  })
})

watch(history, () => renderChart(), { deep: true })

function renderChart() {
  if (!chart.value || !history.value.length) return
  const data = history.value.slice(-60)
  const tempData = data.filter(d => d.temp != null).map(d => [d.ts * 1000, parseFloat(d.temp)])
  const humiData = data.filter(d => d.humi != null).map(d => [d.ts * 1000, parseFloat(d.humi)])

  chart.value.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      textStyle: { fontSize: 12, color: '#0F172A' },
      extraCssText: 'box-shadow:0 4px 12px rgba(0,0,0,0.06);border-radius:8px;',
      formatter: p => {
        if (!p[0]) return ''
        const time = new Date(p[0].value[0]).toLocaleTimeString('zh-CN')
        let s = `<div style="font-size:11px;color:#64748B;margin-bottom:4px">${time}</div>`
        p.forEach(item => {
          s += `<div style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:${item.color}"></span>${item.seriesName}: <b>${item.value[1]}</b></div>`
        })
        return s
      }
    },
    legend: {
      right: 0, top: 0,
      textStyle: { fontSize: 11, color: '#64748B' },
      itemWidth: 12, itemHeight: 3, itemGap: 16
    },
    grid: { left: 0, right: 0, top: 28, bottom: 0, containLabel: true },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#E2E8F0' } },
      axisLabel: { color: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value', name: '°C', position: 'left',
        min: 0, max: 50,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#0B8A6F', fontSize: 10, fontFamily: 'JetBrains Mono' },
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } }
      },
      {
        type: 'value', name: '%', position: 'right',
        min: 0, max: 100,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#3B82F6', fontSize: 10, fontFamily: 'JetBrains Mono' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '温度', type: 'line', smooth: true, symbol: 'none',
        lineStyle: { width: 2.5, color: '#0B8A6F' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(11,138,111,0.10)' },
            { offset: 1, color: 'rgba(11,138,111,0.01)' }
          ])
        },
        data: tempData,
        animationDuration: 800
      },
      {
        name: '湿度', type: 'line', smooth: true, symbol: 'none', yAxisIndex: 1,
        lineStyle: { width: 2.5, color: '#3B82F6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59,130,246,0.10)' },
            { offset: 1, color: 'rgba(59,130,246,0.01)' }
          ])
        },
        data: humiData,
        animationDuration: 800
      }
    ]
  }, true)
}
</script>

<template>
  <div class="mc">
    <div class="mc-head">
      <h3>
        <span class="mc-icon"><span class="material-symbols-outlined">show_chart</span></span>
        最近趋势
      </h3>
      <button class="mc-link" @click="emit('viewAll')">
        查看详情
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
    <div ref="chartEl" class="mc-body"></div>
  </div>
</template>

<style scoped>
.mc {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  margin-bottom: 20px;
}
.mc-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.mc-head h3 {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: var(--text-1);
}
.mc-icon {
  width: 28px; height: 28px; border-radius: var(--r);
  background: var(--primary-50);
  display: flex; align-items: center; justify-content: center;
}
.mc-icon .material-symbols-outlined { color: var(--primary); font-size: 17px; }
.mc-link {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: var(--blue);
  background: transparent; border: none;
  cursor: pointer;
  padding: 5px 10px; border-radius: var(--r-sm);
}
.mc-link:hover { background: var(--blue-50); }
.mc-link .material-symbols-outlined { font-size: 15px; transition: transform 0.2s ease; }
.mc-link:hover .material-symbols-outlined { transform: translateX(2px); }
.mc-body { width: 100%; height: 200px; }

@media (max-width: 768px) { .mc-body { height: 160px; } .mc { padding: 16px; margin-bottom: 14px; } }
</style>
