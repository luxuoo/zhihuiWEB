<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'
import { VISION_CLASSES } from '../config.js'

const emit = defineEmits(['viewAll'])
const api = useApi()
const images = ref([])

onMounted(async () => {
  try { const d = await api.getVisionList(); if (Array.isArray(d)) images.value = d.slice(0, 4) }
  catch (e) { /* ignore */ }
})

const latest = computed(() => images.value.slice(0, 4))
</script>

<template>
  <div class="li">
    <div class="li-head">
      <h3>
        <span class="li-badge"><span class="material-symbols-outlined">photo_camera</span></span>
        最新抓拍
      </h3>
      <button class="li-link" @click="emit('viewAll')">
        查看全部
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </div>
    <div v-if="latest.length === 0" class="li-empty">
      <div class="li-empty-icon"><span class="material-symbols-outlined">image</span></div>
      <p>暂无图像</p>
    </div>
    <div v-else class="li-grid">
      <div v-for="img in latest" :key="img.id" class="li-card">
        <div class="li-thumb">
          <img :src="img.url" loading="lazy" alt="抓拍">
          <div class="li-overlay"><span class="material-symbols-outlined">zoom_in</span></div>
        </div>
        <div class="li-info">
          <span class="li-cls">{{ VISION_CLASSES[img.cls] || img.cls }}</span>
          <span class="li-conf">{{ (img.conf * 100).toFixed(0) }}%</span>
          <span class="li-pest" :class="img.pest ? 'pest' : 'ok'">{{ img.pest ? '病害' : '健康' }}</span>
        </div>
        <div class="li-time">{{ new Date(img.ts * 1000).toLocaleTimeString('zh-CN') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.li {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  flex: 1; min-width: 0;
}
.li-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.li-head h3 {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; color: var(--text-1);
}
.li-badge {
  width: 28px; height: 28px; border-radius: var(--r);
  background: var(--primary-50);
  display: flex; align-items: center; justify-content: center;
}
.li-badge .material-symbols-outlined { color: var(--primary); font-size: 17px; }
.li-link {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: var(--blue);
  background: transparent; border: none;
  cursor: pointer;
  padding: 5px 10px; border-radius: var(--r-sm);
}
.li-link:hover { background: var(--blue-50); }
.li-link .material-symbols-outlined { font-size: 15px; transition: transform 0.2s ease; }
.li-link:hover .material-symbols-outlined { transform: translateX(2px); }

.li-empty { text-align: center; padding: 28px; color: var(--text-3); }
.li-empty-icon {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
}
.li-empty-icon .material-symbols-outlined { font-size: 22px; }
.li-empty p { font-size: 13px; }

.li-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.li-card {
  border-radius: var(--r); overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s ease;
}
.li-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.li-thumb {
  width: 100%; aspect-ratio: 4/3;
  overflow: hidden; background: var(--surface-2);
  position: relative;
}
.li-thumb img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.li-card:hover .li-thumb img { transform: scale(1.04); }
.li-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s ease;
}
.li-overlay .material-symbols-outlined { color: white; font-size: 24px; }
.li-card:hover .li-overlay { opacity: 1; }

.li-info { padding: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.li-cls { font-size: 11px; font-weight: 600; color: var(--text-1); }
.li-conf { font-size: 10px; color: var(--text-3); font-family: 'JetBrains Mono', monospace; }
.li-pest {
  font-size: 9px; font-weight: 600;
  padding: 1px 6px; border-radius: var(--r-full);
}
.li-pest.ok { background: rgba(16,185,129,0.08); color: var(--success); }
.li-pest.pest { background: rgba(239,68,68,0.08); color: var(--error); }
.li-time {
  padding: 0 8px 8px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-3);
}

@media (max-width: 1024px) { .li-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .li-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
</style>
