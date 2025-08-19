<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar (desktop - extra large screens only) -->
    <div class="h-full hidden xl:block" v-show="isSidebarOpen">
      <div class="h-full flex flex-col border border-gray-100 text-gray-200 w-[220px] overflow-hidden relative">
        <div class="flex items-center justify-between pt-3 pb-3 border-b px-3 min-h-[80px]">
          <p class="font-manrope text-sm text-black font-bold ml-3 my-auto">
            Almaty Digital <br />
            Medical Center
          </p>
        </div>
        <div class="flex-1 overflow-y-auto">
          <MenuBox />
        </div>
        <div class="flex border border-gray-100 pt-3 pb-3 border-b px-3">
          <p class="font-manrope text-sm text-gray-400 font-light my-auto">
            version : 1.0.0
          </p>
        </div>
      </div>
    </div>

    <!-- Overlay drawer (mobile/tablet - below xl) -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-50 xl:hidden">
      <div class="absolute inset-0 bg-black/40" @click="isSidebarOpen = false"></div>
      <div class="absolute left-0 top-0 bottom-0 w-[260px] bg-white shadow-2xl">
        <div class="h-full flex flex-col border border-gray-100 text-gray-200 w-full overflow-hidden relative">
          <div class="flex items-center justify-between pt-3 pb-3 border-b px-3 min-h-[80px]">
            <p class="font-manrope text-sm text-black font-bold ml-3 my-auto">
              Almaty Digital <br />
              Medical Center
            </p>
            <button
              class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100"
              @click="isSidebarOpen = false"
            >
              <span class="text-xl material-symbols-outlined text-blue-400">close</span>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <MenuBox />
          </div>
          <div class="flex border border-gray-100 pt-3 pb-3 border-b px-3">
            <p class="font-manrope text-sm text-gray-400 font-light my-auto">
              version : 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col h-screen overflow-x-auto">
      <TopBox @toggle-drawer="toggleSidebar" />
      <div class="p-3 flex-1 overflow-y-auto">
        <div class="bg-gray-100 rounded-xl p-10 h-full w-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import MenuBox from '../components/menu-bar.vue'
import TopBox from '../components/top-box.vue';
import { useRoute } from 'vue-router'

const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1280px)') : null
const isSidebarOpen = ref<boolean>(mediaQuery ? mediaQuery.matches : false)
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    if (!mediaQuery || !mediaQuery.matches) {
      isSidebarOpen.value = false
    }
  }
)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function handleMediaChange(e: MediaQueryListEvent) {
  isSidebarOpen.value = e.matches
}

onMounted(() => {
  if (mediaQuery) {
    mediaQuery.addEventListener('change', handleMediaChange)
  }
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleMediaChange)
  }
})
</script>
