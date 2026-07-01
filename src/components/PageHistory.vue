<script setup>
import { ref, inject, watch, onMounted, nextTick, shallowRef } from 'vue'
import { useApi } from '../composables/useApi.js'
import { METRICS, TIME_RANGES } from '../config.js'
import * as echarts from 'echarts'

const history = inject('history')
const api = useApi()
const metric = ref('temp')
const timeRange = ref('1h')
const chartEl = ref(null)
const chart = shallowRef(null)
const stats = ref({min:'--',max:'--',avg:'--',count:'--'})

onMounted(() => {
  nextTick(() => {
    if (chartEl.value) {
      chart.value = echarts.init(chartEl.value)
      window.addEventListener('resize', () => chart.value?.resize())
      renderChart()
    }
  })
})

watch([metric, timeRange, history], () => renderChart(), { deep: true })

function renderChart() {
  if (!chart.value || !history.value.length) return
  const mc = METRICS[metric.value]
  const tr = TIME_RANGES[timeRange.value]
  const now = Math.floor(Date.now()/1000)
  const from = now - tr.hours * 3600
  const data = history.value.filter(d => d.ts >= from)
  const use = data.length > 0 ? data : history.value

  const seriesData = use.filter(d => d[metric.value] != null).map(d => [d.ts*1000, parseFloat(d[metric.value])])
  const vals = seriesData.map(d => d[1])

  const markLines = []
  if (mc.threshold) markLines.push({yAxis:mc.threshold, lineStyle:{color:'#DC2626',type:'dashed',width:1}, label:{formatter:`阈值 ${mc.threshold}${mc.unit}`,position:'insideEndTop',color:'#DC2626',fontSize:10}})
  if (mc.thresholdLow) markLines.push({yAxis:mc.thresholdLow, lineStyle:{color:'#F59E0B',type:'dashed',width:1}, label:{formatter:`下限`,position:'insideEndTop',color:'#F59E0B',fontSize:10}})
  if (mc.thresholdHigh) markLines.push({yAxis:mc.thresholdHigh, lineStyle:{color:'#F59E0B',type:'dashed',width:1}, label:{formatter:`上限`,position:'insideEndTop',color:'#F59E0B',fontSize:10}})

  chart.value.setOption({
    title:{text:`${mc.name}历史曲线`,left:'center',textStyle:{fontSize:14,fontWeight:'500',color:'#111827'}},
    tooltip:{trigger:'axis',backgroundColor:'rgba(255,255,255,0.96)',borderColor:'#E2E5E9',borderWidth:1,textStyle:{fontSize:12,color:'#111827'},formatter:p=>p[0]?`${new Date(p[0].value[0]).toLocaleString('zh-CN')}<br/>${mc.name}: ${p[0].value[1]} ${mc.unit}`:'',extraCssText:'box-shadow:0 4px 12px rgba(0,0,0,0.08);border-radius:8px;'},
    grid:{left:'3%',right:'4%',bottom:'3%',top:'12%',containLabel:true},
    xAxis:{type:'time',axisLine:{lineStyle:{color:'#E2E5E9'}},axisLabel:{color:'#6B7280',fontFamily:'JetBrains Mono',fontSize:11},splitLine:{show:false}},
    yAxis:{type:'value',name:mc.unit,min:mc.min,max:mc.max,axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#6B7280',fontFamily:'JetBrains Mono',fontSize:11},splitLine:{lineStyle:{color:'#ECEEF1',type:'dashed'}}},
    series:[{type:'line',smooth:true,symbol:'none',lineStyle:{width:2.5,color:mc.color},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:mc.color+'25'},{offset:1,color:mc.color+'05'}])},data:seriesData,markLine:{silent:true,data:markLines},animationDuration:800,animationEasing:'cubicOut'}]
  }, true)

  if (vals.length) {
    stats.value = {min:`${Math.min(...vals).toFixed(1)} ${mc.unit}`,max:`${Math.max(...vals).toFixed(1)} ${mc.unit}`,avg:`${(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(1)} ${mc.unit}`,count:vals.length}
  }
}
</script>

<template>
  <div class="page-enter">
    <div class="controls">
      <div class="selector">
        <button v-for="(m,k) in METRICS" :key="k" class="sel-btn" :class="{active:metric===k}" @click="metric=k">
          <span class="material-symbols-outlined">{{ k==='temp'?'thermostat':k==='humi'?'water_drop':k==='lux'?'sunny':k==='water'?'water':'air' }}</span>
          {{ m.name }}
        </button>
      </div>
      <div class="selector time-selector">
        <button v-for="(r,k) in TIME_RANGES" :key="k" class="sel-btn time" :class="{active:timeRange===k}" @click="timeRange=k">{{ r.label }}</button>
      </div>
    </div>
    <div class="chart-wrap">
      <div ref="chartEl" class="chart"></div>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="stat-icon"><span class="material-symbols-outlined">arrow_downward</span></span>
        <span class="sl">最小值</span>
        <span class="sv">{{ stats.min }}</span>
      </div>
      <div class="stat">
        <span class="stat-icon up"><span class="material-symbols-outlined">arrow_upward</span></span>
        <span class="sl">最大值</span>
        <span class="sv">{{ stats.max }}</span>
      </div>
      <div class="stat">
        <span class="stat-icon avg"><span class="material-symbols-outlined">analytics</span></span>
        <span class="sl">平均值</span>
        <span class="sv">{{ stats.avg }}</span>
      </div>
      <div class="stat">
        <span class="stat-icon count"><span class="material-symbols-outlined">data_array</span></span>
        <span class="sl">数据点</span>
        <span class="sv">{{ stats.count }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter { animation: fadeInUp 0.4s ease; }
@keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

.controls {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
}
.selector {
  display: flex; gap: 2px;
  background: var(--surface);
  padding: 3px; border-radius: var(--r);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.sel-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px;
  border: none; background: transparent;
  color: var(--text-2);
  font-size: 12px; font-weight: 500;
  border-radius: var(--r-sm);
  cursor: pointer; transition: var(--ease);
}
.sel-btn:hover { color: var(--text-1); background: var(--surface-2); }
.sel-btn.active {
  color: var(--primary);
  background: var(--primary-50);
  font-weight: 600;
}
.sel-btn .material-symbols-outlined { font-size: 17px; }
.sel-btn.time.active {
  color: white;
  background: var(--blue);
  box-shadow: 0 2px 6px rgba(59,130,246,0.25);
}
.chart-wrap {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 20px; margin-bottom: 18px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.chart { width: 100%; height: 380px; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat {
  background: var(--surface);
  border-radius: var(--r);
  padding: 16px; text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: var(--ease);
  position: relative;
}
.stat:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.stat-icon {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--primary-50);
  margin: 0 auto 8px;
}
.stat-icon .material-symbols-outlined { font-size: 16px; color: var(--primary); }
.stat-icon.up { background: var(--blue-50); }
.stat-icon.up .material-symbols-outlined { color: var(--blue); }
.stat-icon.avg { background: var(--violet-50); }
.stat-icon.avg .material-symbols-outlined { color: var(--violet); }
.stat-icon.count { background: var(--surface-2); }
.stat-icon.count .material-symbols-outlined { color: var(--text-3); }
.sl {
  display: block;
  font-size: 10px; font-weight: 600; color: var(--text-3);
  text-transform: uppercase; letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.sv {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px; font-weight: 700; color: var(--text-1);
}

@media(max-width:768px) {
  .controls { flex-direction: column; align-items: stretch; gap: 8px; }
  .selector { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .selector::-webkit-scrollbar { display: none; }
  .sel-btn { padding: 6px 10px; font-size: 11px; white-space: nowrap; }
  .chart-wrap { padding: 12px; margin-bottom: 12px; }
  .chart { height: 260px; }
  .stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .stat { padding: 12px; }
  .sv { font-size: 14px; }
}
</style>
