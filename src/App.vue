<script setup>
import { ref, computed, provide } from 'vue'
import { usePolling } from './composables/usePolling.js'
import { useToast } from './composables/useToast.js'
import { useApi } from './composables/useApi.js'
import SideBar from './components/SideBar.vue'
import TopHeader from './components/TopHeader.vue'
import MobileHeader from './components/MobileHeader.vue'
import PageDashboard from './components/PageDashboard.vue'
import PageHistory from './components/PageHistory.vue'
import PageCamera from './components/PageCamera.vue'
import PageAlarm from './components/PageAlarm.vue'
import PageSettings from './components/PageSettings.vue'
import AboutDialog from './components/AboutDialog.vue'
import ToastContainer from './components/ToastContainer.vue'

const { history, latest, loading, refresh } = usePolling()
const { toasts, show: showToast } = useToast()
const api = useApi()
const activeTab = ref('dashboard')
const showSettings = ref(false)
const showAbout = ref(false)

provide('history', history)
provide('latest', latest)
provide('loading', loading)
provide('refresh', refresh)
provide('showToast', showToast)

const pages = { dashboard: PageDashboard, history: PageHistory, camera: PageCamera, alarm: PageAlarm }
const currentPage = computed(() => pages[activeTab.value])

async function handleEmergency() {
  try {
    await api.toggleRelay('light', 0)
    await api.toggleRelay('fan', 0)
    showToast('紧急停止：所有设备已关闭', 'warning')
  } catch (e) {
    showToast('紧急停止失败', 'error')
  }
}

function openAlarmTab() { activeTab.value = 'alarm' }
</script>

<template>
  <SideBar v-model:tab="activeTab"
    @emergency="handleEmergency"
    @settings="showSettings = true"
    @about="showAbout = true" />

  <div class="main-area">
    <TopHeader @refresh="refresh(); showToast('数据已刷新','success')" />
    <MobileHeader @open-alarm="openAlarmTab" />
    <div class="scroll-area">
      <component :is="currentPage" :key="activeTab" />
    </div>
  </div>

  <!-- 底部导航 (移动端) -->
  <nav class="bottom-nav">
    <button v-for="t in [{k:'dashboard',i:'dashboard',l:'监控'},{k:'history',i:'show_chart',l:'历史'},{k:'camera',i:'photo_library',l:'图像'},{k:'alarm',i:'notifications',l:'告警'}]"
      :key="t.k"
      class="bn-item" :class="{ active: activeTab === t.k }"
      @click="activeTab = t.k">
      <span class="material-symbols-outlined">{{ t.i }}</span>
      <span>{{ t.l }}</span>
    </button>
  </nav>

  <ToastContainer :toasts="toasts" />
  <PageSettings v-if="showSettings" @close="showSettings = false" />
  <AboutDialog v-if="showAbout" @close="showAbout = false" />
</template>

<style scoped>
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
}
.scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 28px 40px;
}

/* 底部导航 */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  z-index: 30;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
}
.bn-item {
  display: flex; flex-direction: column; align-items: center;
  gap: 2px;
  padding: 6px 18px;
  color: var(--text-3);
  font-size: 10px; font-weight: 500;
  border: none; background: transparent;
  cursor: pointer;
  border-radius: var(--r);
  position: relative;
}
.bn-item .material-symbols-outlined { font-size: 22px; }
.bn-item.active {
  color: var(--primary);
}
.bn-item.active::after {
  content: '';
  position: absolute;
  top: 2px; left: 50%; transform: translateX(-50%);
  width: 16px; height: 3px;
  border-radius: 3px;
  background: var(--primary);
}

@media(max-width:768px) {
  .scroll-area { padding: 14px 14px 80px; }
  .bottom-nav { display: flex; }
}
</style>
