import { API_BASE, DEVICE_ID } from '../config.js'

async function get(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin)
  url.searchParams.set('device_id', DEVICE_ID)
  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, v)
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  // 后端返回格式不统一，统一提取 data 字段或直接返回数组
  if (Array.isArray(json)) return json
  if (json.data && Array.isArray(json.data)) return json.data
  return json
}

async function post(endpoint, body = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: DEVICE_ID, ...body }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useApi() {
  return {
    getHistory:    ()           => get('/history'),
    getVisionList: ()           => get('/vision/latest'),
    toggleRelay:   (relay, st)  => post('/cmd', { [relay]: st }),
    setMode:       (mode)       => post('/cmd', { mode }),
    saveThresholds:(t)          => post('/cmd', t),
    triggerSnap:   ()           => post('/cmd', { snap: 1 }),
  }
}
