<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Static sidebar on desktop (lg and up) -->
    <div class="hidden lg:block h-full">
      <div :class="['h-full flex flex-col border border-gray-100 text-gray-200 overflow-hidden relative transition-all duration-200', isSidebarCollapsed ? 'w-0' : 'w-[220px]']">
        <div class="flex items-center justify-between pt-3 pb-3 border-b px-3 min-h-[80px]">
          <p v-if="!isSidebarCollapsed" class="font-manrope text-sm text-black font-bold ml-3 my-auto">
            Almaty Digital <br />
            Medical Center
          </p>
        </div>
        <div class="flex-1 overflow-y-auto" v-show="!isSidebarCollapsed">
          <MenuBox />
        </div>
        <div v-if="!isSidebarCollapsed" class="flex border border-gray-100  pt-3 pb-3 border-b px-3">
          <p class="font-manrope text-sm text-gray-400 font-light my-auto">
           version : 1.0.0
          </p>
        </div>
      </div>
    </div>

    <!-- Drawer sidebar on mobile/tablet with mask -->
    <a-drawer
      :open="isDrawerOpen"
      placement="left"
      :closable="false"
      :width="220"
      :maskClosable="true"
      @close="isDrawerOpen = false"
      class="lg:hidden"
    >
      <template #title>
        <div class="flex items-center justify-between">
          <p class="font-manrope text-sm text-black font-bold my-auto">
            Almaty Digital <br />
            Medical Center
          </p>
          <button
            class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100"
            @click="isDrawerOpen = false"
          >
            <span class="text-xl material-symbols-outlined text-blue-400">close</span>
          </button>
        </div>
      </template>
      <MenuBox />
      <div class="flex pt-3 pb-3 px-3">
        <p class="font-manrope text-sm text-gray-400 font-light my-auto">
         version : 1.0.0
        </p>
      </div>
    </a-drawer>

    <!-- Main content -->
    <div class="flex-1 flex flex-col h-screen overflow-x-auto">
      <TopBox @toggle-drawer="onToggleMenu" />
      <div class="p-3 flex-1 overflow-y-auto">
        <div class="bg-gray-100 rounded-xl p-10 h-full w-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuBox from '../components/menu-bar.vue'
import TopBox from '../components/top-box.vue';

const isDrawerOpen = ref(false)
const isSidebarCollapsed = ref(false)

const onToggleMenu = () => {
  // На мобильных/планшетах (включая iPad) — Drawer с маской; на десктопе — полное скрытие/показ сайдбара
  if (window.matchMedia('(min-width: 1024px)').matches) {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  } else {
    isDrawerOpen.value = !isDrawerOpen.value
  }
}
</script>
