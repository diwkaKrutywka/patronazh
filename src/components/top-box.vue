<template>
  <div
    class="relative flex shadow gap-1 h-20 pr-3 pl-3 justify-between items-center"
  >
    <!-- Left section -->
    <div class="flex items-center gap-1">
      <div
        class="bg-transparent flex items-center border border-blue-100 rounded-md cursor-pointer"
        @click="$emit('toggle-drawer')"
        title="Menu"
      >
        <span
          class="text-xl material-symbols-outlined text-blue-400 bg-blue-100"
          >menu</span
        >
      </div>
      <div class="flex items-center gap-1 h-full ml-4">
        <div class="flex flex-col">
          <span class="font-bold text-2xl">Патронаж</span>
        </div>
      </div>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-4 z-10">
      <ChangeLanguageBox class="flex items-center" />

   

      <div class="relative" ref="dropdownRef">
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="toggleUserDropdown"
        >
          <span class="text-xl material-symbols-outlined">person</span>
          <span class="font-medium">{{ userStore.user?.full_name }}</span>
        </div>

        <div
          v-show="isUserDropdownOpen"
          class="absolute right-0 mt-2 w-96 bg-white text-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
        >
          <div
            class="flex flex-col items-center p-6 pb-4 bg-gradient-to-b from-blue-50 to-white"
          >
            <div
              class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2"
            >
              <span class="material-symbols-outlined text-4xl text-blue-500"
                >person</span
              >
            </div>
            <div class="font-bold text-lg mb-1">
              {{ userStore.user?.full_name || "User" }}
            </div>
            <div
              class="text-sm text-gray-500 mb-2"
              v-if="userStore.user?.email"
            >
              {{ userStore.user?.email }}
            </div>
            <div class="flex flex-col w-full divide-y">
              <template v-for="([key, value], idx) in filteredUserEntries" :key="key + '_' + idx">
                <div class="flex items-start justify-between gap-3 py-1.5"  v-if="key!='id' && key!='organization_id'">
                  <span class="text-[11px] text-gray-400 uppercase tracking-wider w-44 shrink-0" >{{ getLabel(key) }}</span>
                  <span class="text-sm text-gray-700 truncate max-w-[18rem] md:max-w-[24rem]"  :title="value">
                    <template v-if="value === 'true'">
                      <span class="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{{ $t('l_Yes') }}</span>
                    </template>
                    <template v-else-if="value === 'false'">
                      <span class="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">{{ $t('l_No') }}</span>
                    </template>
                    <template v-else>
                      {{ value }}
                    </template>
                  </span>
                </div>
              </template>
            </div>
          </div>
          <div
            class="px-6 pb-4 pt-2 text-red cursor-pointer"
            @click="onSignOut"
          >
            <span class="material-symbols-outlined">logout</span>
            {{ $t('l_Sign_out') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import ChangeLanguageBox from "./change-language-box.vue";
import { useUserStore } from "../store/index";
import { storeToRefs } from "pinia";
import {  ref, computed } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';


const emit = defineEmits(["toggle-drawer"]);
const userStore = useUserStore();
const userInfo = storeToRefs(userStore);
const isUserDropdownOpen = ref(false);
const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};
// router-related code removed as unused
const router = useRouter();

const onSignOut = () => {
  userStore.clear();
  try {
    localStorage.clear();
  } catch {}
  isUserDropdownOpen.value = false;
  router.push('/login');
};
const dropdownRef = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isUserDropdownOpen.value = false;
  }
};
// unused formatter removed
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Filtered user entries for dropdown
const filteredUserEntries = computed(() => {
  const user = userInfo.user.value as Record<string, unknown> | null | undefined;
  if (!user || typeof user !== 'object') return [] as Array<[string, string]>;
  const excluded = new Set(['username', 'email', 'avatar', 'full_name']);
  const result: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(user)) {
    if (excluded.has(key)) continue;
    if (value == null) continue;
    const val = typeof value === 'string' || typeof value === 'number'
      ? String(value)
      : JSON.stringify(value);
    result.push([key, val]);
  }
  return result;
});

// Map raw user keys to i18n labels
const labelKeyByUserField: Record<string, string> = {
  is_supervisor: 'user_label_is_supervisor',
  role: 'user_label_role',
  organization: 'user_label_organization',
  org: 'user_label_organization',
  department: 'user_label_department',
  position: 'user_label_position',
  phone: 'user_label_phone',
  code: 'user_label_code',
  nurse_code: 'user_label_nurse_code',
  region: 'user_label_region',
  district: 'user_label_district',
  branch: 'user_label_branch',
  
};

const getLabel = (key: string): string => {
  const tKey = labelKeyByUserField[key];
  const { t } = useI18n();
  if (tKey) return t(tKey) as string;
  // Fallback: prettify unknown keys
  const pretty = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return pretty;
};
</script>
