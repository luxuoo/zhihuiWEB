import { ref, onMounted, onUnmounted } from 'vue'
import { useApi } from './useApi.js'
import { REFRESH_INTERVAL } from '../config.js'

function generateMockData() {
  const now = Math.floor(Date.now() / 1000)
  return {
    ts: now,
    temp: (22 + Math.random() * 8).toFixed(1),
    humi: (40 + Math.random() * 30).toFixed(1),
    lux: (200 + Math.random() * 600).toFixed(0),
    water: (800 + Math.random() * 400).toFixed(0),
    air: Math.floor(30 + Math.random() * 70),
    pump: Math.random() > 0.7 ? 1 : 0,
    light: Math.random() > 0.6 ? 1 : 0,
    fan: Math.random() > 0.8 ? 1 : 0,
    mode: Math.random() > 0.3 ? 'auto' : 'manual',
    nodes: { n1: 1, n2: 1 },
    vision: {
      cls: Math.random() > 0.9 ? 'leaf_spot' : 'healthy',
      conf: (0.85 + Math.random() * 0.15).toFixed(2),
      pest: Math.random() > 0.9 ? 1 : 0,
    },
  }
}

export function usePolling() {
  const api = useApi()
  const history = ref([])
  const latest = ref(null)
  const loading = ref(true)
  let timer = null
  let useMock = false

  async function fetch() {
    try {
      if (useMock) {
        // 模拟数据模式：每轮生成一条新数据
        const mock = generateMockData()
        history.value.push(mock)
        if (history.value.length > 2000) history.value.shift()
        latest.value = mock
        return
      }
      const data = await api.getHistory()
      if (Array.isArray(data) && data.length > 0) {
        history.value = data
        latest.value = data[data.length - 1]
      }
      loading.value = false
    } catch (e) {
      console.warn('API 不可用，使用模拟数据:', e.message)
      useMock = true
      // 生成一批初始历史数据
      const mockHistory = Array.from({ length: 60 }, () => generateMockData())
      history.value = mockHistory
      latest.value = mockHistory[mockHistory.length - 1]
      loading.value = false
    }
  }

  onMounted(() => {
    fetch()
    timer = setInterval(fetch, REFRESH_INTERVAL)
  })

  onUnmounted(() => { clearInterval(timer) })

  return { history, latest, loading, refresh: fetch }
}
