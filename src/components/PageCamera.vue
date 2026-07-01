<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'
import { VISION_CLASSES } from '../config.js'

const api = useApi()
const showToast = inject('showToast')
const images = ref([])
const showAll = ref(false)
const modalImg = ref(null)

onMounted(loadImages)

async function loadImages() {
  try { const d = await api.getVisionList(); if(Array.isArray(d)) images.value = d }
  catch(e) { console.error(e) }
}

async function triggerSnap() {
  try { await api.triggerSnap(); showToast('已发送拍照指令','info') }
  catch(e) { showToast('发送失败','error') }
}

const groups = computed(() => {
  const map = {}
  images.value.forEach((img, idx) => {
    const date = new Date(img.ts*1000).toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'})
    if(!map[date]) map[date] = []
    map[date].push({...img, _idx: idx})
  })
  return map
})

const visibleDates = computed(() => {
  const dates = Object.keys(groups.value)
  return showAll.value ? dates : dates.slice(0,1)
})

function visibleCount(date) {
  const g = groups.value[date]
  if(showAll.value || date !== Object.keys(groups.value)[0]) return g.length
  return Math.min(3, g.length)
}

function openModal(idx) { modalImg.value = images.value[idx] }
function closeModal() { modalImg.value = null }
</script>

<template>
  <div class="page-enter">
    <div class="cam-header">
      <h2>
        <span class="header-icon"><span class="material-symbols-outlined">photo_camera</span></span>
        抓拍图像
        <span v-if="images.length" class="img-count">{{ images.length }}</span>
      </h2>
      <button class="btn-snap" @click="triggerSnap">
        <span class="material-symbols-outlined">camera</span> 立即拍照
      </button>
    </div>

    <div v-if="images.length===0" class="empty">
      <div class="empty-icon">
        <span class="material-symbols-outlined">image</span>
      </div>
      <p class="empty-title">暂无抓拍图像</p>
      <p class="hint">设备将定期自动抓拍，或点击上方按钮手动触发</p>
    </div>

    <template v-else>
      <div v-for="date in visibleDates" :key="date" class="date-group">
        <div class="date-label">
          <span class="material-symbols-outlined">calendar_today</span>
          {{ date }}
          <span class="count">{{ groups[date].length }} 张</span>
        </div>
        <div class="img-grid">
          <div v-for="img in groups[date].slice(0, visibleCount(date))" :key="img._idx" class="img-card" @click="openModal(img._idx)">
            <div class="img-wrap">
              <img :src="img.url" loading="lazy" alt="抓拍">
              <div class="img-overlay">
                <span class="material-symbols-outlined">zoom_in</span>
              </div>
            </div>
            <div class="img-info">
              <div class="img-time">
                <span class="material-symbols-outlined">schedule</span>
                {{ new Date(img.ts*1000).toLocaleTimeString('zh-CN') }}
              </div>
              <div class="img-result">
                <span class="img-cls">{{ VISION_CLASSES[img.cls]||img.cls }}</span>
                <span class="img-conf">{{ (img.conf*100).toFixed(0) }}%</span>
                <span class="pest-badge" :class="img.pest?'pest':'healthy'">{{ img.pest?'病虫害':'健康' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button v-if="!showAll && images.length>3" class="btn-more" @click="showAll=true">
        <span class="material-symbols-outlined">expand_more</span>查看全部 {{ images.length }} 张
      </button>
      <button v-if="showAll && images.length>3" class="btn-more" @click="showAll=false">
        <span class="material-symbols-outlined">expand_less</span>收起
      </button>
    </template>

    <!-- 模态框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalImg" class="modal" @click.self="closeModal">
          <div class="modal-box">
            <button class="modal-close" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
            <div class="modal-img"><img :src="modalImg.url" alt="抓拍"></div>
            <div class="modal-info">
              <div class="modal-meta">
                <p><strong>时间:</strong> {{ new Date(modalImg.ts*1000).toLocaleString('zh-CN') }}</p>
                <p><strong>识别:</strong> {{ VISION_CLASSES[modalImg.cls]||modalImg.cls }}</p>
                <p><strong>置信度:</strong> {{ (modalImg.conf*100).toFixed(1) }}%</p>
                <p><strong>状态:</strong> {{ modalImg.pest?'检测到病虫害':'健康' }}</p>
              </div>
              <button class="btn-analyze" @click="showToast('AI 分析开发中','info')">
                <span class="material-symbols-outlined">psychology</span> AI 分析
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-enter { animation: fadeInUp 0.4s ease; }
@keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

.cam-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px;
}
.cam-header h2 {
  display: flex; align-items: center; gap: 10px;
  font-size: 17px; font-weight: 600;
}
.header-icon {
  width: 32px; height: 32px; border-radius: var(--r-sm);
  background: rgba(26,109,92,0.06);
  display: flex; align-items: center; justify-content: center;
}
.header-icon .material-symbols-outlined { color: var(--primary); font-size: 19px; }
.img-count {
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: var(--r-full);
  background: var(--surface-2); color: var(--text-3);
  font-family: 'JetBrains Mono', monospace;
}
.btn-snap {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: var(--primary); color: var(--text-inv);
  border: none; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: var(--ease);
  box-shadow: 0 2px 6px rgba(26,109,92,0.2);
}
.btn-snap:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 10px rgba(11,138,111,0.25); }
.btn-snap:active { transform: translateY(0); }
.btn-snap .material-symbols-outlined { font-size: 17px; }

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
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.empty-icon .material-symbols-outlined { font-size: 32px; color: var(--text-3); }
.empty-title { color: var(--text-1); font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.hint { font-size: 12px; color: var(--text-3); }

/* 日期分组 */
.date-group { margin-bottom: 22px; }
.date-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 600; color: var(--text-2);
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.date-label .material-symbols-outlined { font-size: 16px; color: var(--primary); }
.date-label .count {
  font-size: 11px; color: var(--text-3); margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
}

/* 图片网格 */
.img-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.img-card {
  background: var(--surface);
  border-radius: var(--r);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: var(--ease);
  cursor: pointer;
}
.img-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.img-wrap {
  width: 100%; aspect-ratio: 4/3;
  overflow: hidden; background: var(--surface-2);
  position: relative;
}
.img-wrap img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.img-card:hover .img-wrap img { transform: scale(1.04); }
.img-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s ease;
}
.img-overlay .material-symbols-outlined { color: white; font-size: 28px; }
.img-card:hover .img-overlay { opacity: 1; }

.img-info { padding: 12px; }
.img-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--text-3);
  margin-bottom: 6px;
  display: flex; align-items: center; gap: 4px;
}
.img-time .material-symbols-outlined { font-size: 13px; }
.img-result { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.img-cls { font-size: 12px; font-weight: 600; color: var(--text-1); }
.img-conf { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-3); }
.pest-badge { padding: 2px 8px; border-radius: var(--r-full); font-size: 10px; font-weight: 600; }
.pest-badge.healthy { background: #DCFCE7; color: #166534; }
.pest-badge.pest { background: #FEE2E2; color: #991B1B; }

.btn-more {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 12px; margin-top: 14px;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--r-sm);
  color: var(--text-2);
  font-size: 13px; font-weight: 500;
  cursor: pointer; transition: var(--ease);
}
.btn-more:hover { background: var(--surface-2); border-color: var(--border); color: var(--primary); }
.btn-more .material-symbols-outlined { font-size: 18px; }

/* 模态框 */
.modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 40px;
  backdrop-filter: blur(6px);
}
.modal-box {
  background: var(--surface);
  border-radius: var(--r-xl);
  max-width: 860px; width: 100%;
  max-height: 90vh; overflow: auto;
  position: relative;
  box-shadow: var(--shadow-lg);
  animation: scaleIn 0.25s ease;
}
@keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
.modal-close {
  position: absolute; top: 12px; right: 12px;
  width: 36px; height: 36px;
  border: none; background: rgba(0,0,0,0.5);
  color: white; border-radius: var(--r-full);
  cursor: pointer; z-index: 10;
  display: flex; align-items: center; justify-content: center;
  transition: var(--ease);
}
.modal-close:hover { background: rgba(0,0,0,0.7); }
.modal-close .material-symbols-outlined { font-size: 20px; }
.modal-img {
  width: 100%; max-height: 55vh;
  display: flex; align-items: center; justify-content: center;
  background: #111; overflow: hidden;
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}
.modal-img img { width: 100%; height: 100%; object-fit: contain; }
.modal-info {
  padding: 20px;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.modal-meta { font-size: 13px; color: var(--text-2); line-height: 1.8; }
.modal-meta strong { color: var(--text-1); font-weight: 600; }
.btn-analyze {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: var(--violet); color: white;
  border: none; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 600;
  cursor: pointer; transition: var(--ease);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(124,58,237,0.25);
}
.btn-analyze:hover { background: #6D28D9; transform: translateY(-1px); }
.btn-analyze .material-symbols-outlined { font-size: 17px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media(max-width:1024px) { .img-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width:768px) {
  .cam-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .cam-header h2 { font-size: 15px; }
  .btn-snap { width: 100%; justify-content: center; }
  .img-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .img-info { padding: 10px; }
  .img-time { font-size: 10px; }
  .img-cls { font-size: 11px; }
  .pest-badge { font-size: 9px; padding: 2px 6px; }
  .date-label { font-size: 11px; }
  .btn-more { padding: 10px; font-size: 12px; }
  .modal { padding: 12px; }
  .modal-info { flex-direction: column; align-items: flex-start; gap: 12px; }
  .modal-meta { font-size: 12px; }
  .btn-analyze { width: 100%; justify-content: center; }
}
@media(max-width:380px) { .img-grid { grid-template-columns: 1fr; } }
</style>
