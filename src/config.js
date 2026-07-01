export const API_BASE = '/api'
export const DEVICE_ID = 'gh01'
export const REFRESH_INTERVAL = 5000
export const TOAST_DURATION = 3000

export const METRICS = {
  temp:  { name: '温度', unit: '°C',  color: '#0B8A6F', min: 0, max: 50,   threshold: 35 },
  humi:  { name: '湿度', unit: '%',   color: '#3B82F6', min: 0, max: 100,  threshold: 60 },
  lux:   { name: '光照', unit: 'Lux', color: '#F59E0B', min: 0, max: 2000, threshold: 500 },
  water: { name: '水位', unit: 'mm',  color: '#3B82F6', min: 0, max: 2000, thresholdLow: 300, thresholdHigh: 1500 },
  air:   { name: '空气', unit: 'AQI', color: '#0B8A6F', min: 0, max: 500,  threshold: 100 },
}

export const TIME_RANGES = {
  '1h':  { label: '1小时', hours: 1 },
  '6h':  { label: '6小时', hours: 6 },
  '24h': { label: '24小时', hours: 24 },
  '7d':  { label: '7天',   hours: 168 },
}

export const AIR_LEVELS = [
  { min: 0,   max: 50,  label: '优秀',     cls: 'good' },
  { min: 51,  max: 100, label: '良好',     cls: 'good' },
  { min: 101, max: 150, label: '轻度污染', cls: 'moderate' },
  { min: 151, max: 200, label: '中度污染', cls: 'moderate' },
  { min: 201, max: 300, label: '重度污染', cls: 'poor' },
  { min: 301, max: 500, label: '严重污染', cls: 'poor' },
]

export const VISION_CLASSES = {
  healthy: '健康', leaf_spot: '叶斑病', powdery_mildew: '白粉病',
  rust: '锈病', aphid: '蚜虫', whitefly: '白粉虱', spider_mite: '红蜘蛛',
}

export const ALARM_TYPES = {
  temp_high:     { title: '温度过高',     icon: 'thermostat',    level: 'danger' },
  temp_low:      { title: '温度过低',     icon: 'ac_unit',       level: 'warning' },
  humi_high:     { title: '湿度过高',     icon: 'water_drop',    level: 'warning' },
  humi_low:      { title: '湿度过低',     icon: 'dry',           level: 'warning' },
  lux_low:       { title: '光照不足',     icon: 'cloud',         level: 'warning' },
  water_low:     { title: '水位过低',     icon: 'water',         level: 'danger' },
  water_high:    { title: '水位过高',     icon: 'water',         level: 'warning' },
  air_poor:      { title: '空气质量差',   icon: 'air',           level: 'warning' },
  pest_detected: { title: '检测到病虫害', icon: 'bug_report',    level: 'danger' },
  device_offline:{ title: '设备离线',     icon: 'wifi_off',      level: 'danger' },
  node_offline:  { title: '节点离线',     icon: 'device_hub',    level: 'warning' },
}

export const DEFAULT_THRESHOLDS = { TH_TEMP:35, TH_HUMI:60, TH_LUX:500, TH_WATER_LOW:300, TH_WATER_HIGH:1500 }
