<template>
  <div>
    <!-- Мобильный/планшетный заголовок -->
    <div class="block lg:hidden px-3">
      <span class="text-xl font-bold mb-2">{{ $t("l_Closed_cases") }}</span>
    </div>
    <a-page-header :title="$t('l_Closed_cases')">
      <template #extra>
        <div
          class="flex flex-wrap gap-3 w-full flex-col sm:flex-row items-stretch sm:items-center sm:justify-end"
        >
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            class="search-input w-full sm:w-[400px]"
            @search="fetchClosedCases"
            allowClear
          />

          <!-- Фильтры -->
          <a-popover
            trigger="click"
            v-model:open="filtersOpen"
            placement="bottomLeft"
          >
            <template #content>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-[92vw] max-w-[420px]"
              >
                <div>
                  <a-date-picker
                    v-model:value="currentFilters.closed_date_from"
                    :placeholder="$t('l_Closure_date_from')"
                    valueFormat="YYYY-MM-DD"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div>
                <div>
                  <a-date-picker
                    v-model:value="currentFilters.closed_date_to"
                    :placeholder="$t('l_Closure_date_to')"
                    valueFormat="YYYY-MM-DD"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.ordering"
                    :placeholder="$t('l_Sort_by')"
                    allowClear
                    size="small"
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="-closed_date">{{ $t("l_Newest_first") }}</a-select-option>
                    <a-select-option value="closed_date">{{ $t("l_Oldest_first") }}</a-select-option>
                    <a-select-option value="patient_full_name">{{ $t("l_By_patient_name") }}</a-select-option>
                    <a-select-option value="created_at">{{ $t("l_By_creation_date") }}</a-select-option>
                  </a-select>
                </div>
                <div class="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <a-button class="w-full sm:w-auto" @click="resetFilters">{{
                    $t("l_Reset")
                  }}</a-button>
                  <a-button
                    class="w-full sm:w-auto"
                    type="primary"
                    @click="applyFilters"
                    >{{ $t("l_Apply_filters") }}</a-button
                  >
                </div>
              </div>
            </template>
            <a-button
              class="w-full sm:w-auto min-w-[150px]"
              type="primary"
              ghost
            >
              <span class="icon active material-symbols-outlined"
                >filter_alt <span>{{ $t("l_Filter") }}</span></span
              >
            </a-button>
          </a-popover>

          <!-- Кнопка скачать Excel -->
          <a-button type="primary" @click="downloadExcel" class="w-full sm:w-auto"
            >📄 {{ $t("l_Download_excel") }}</a-button
          >
        </div>
      </template>
    </a-page-header>

    <!-- Табы -->
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="pregnant-women" :tab="$t('l_Pregnant_women')">
        <!-- Таблица для беременных женщин -->
        <div class="table-wrapper">
          <a-table
            bordered
            :dataSource="tableData"
            :columns="pregnantColumns"
            :pagination="pagination"
            rowKey="id"
            :loading="loading"
            :scroll="{ x: 1200 }"
            size="small"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'patient_full_name'">
                <div class="flex items-center gap-2">
                  <a-avatar
                    :style="{
                      backgroundColor: '#E5EDFF',
                      color: '#2B4EFF',
                      fontWeight: '600',
                    }"
                  >
                    {{ record.patient_full_name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() }}
                  </a-avatar>
                  <span class="truncate">
                    {{ record.patient_full_name }}
                  </span>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'closed_date'">
                {{ record.closed_date ? dayjs(record.closed_date).format("DD.MM.YYYY") : "" }}
              </template>
              <template v-else-if="column.dataIndex === 'created_at'">
                {{ record.created_at ? dayjs(record.created_at).format("DD.MM.YYYY") : "" }}
              </template>
              <template v-else-if="column.key === 'Action'">
                <a-space size="small">
                <img class="w-[18px] cursor-pointer hover:opacity-70" src="../../assets/turn-left.png" @click="onReturn(record)" :title="$t('l_Return')" />
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="children" :tab="$t('l_Kids')" force-render>
        <!-- Таблица для детей -->
        <div class="table-wrapper">
          <a-table
            bordered
            :dataSource="tableData"
            :columns="childrenColumns"
            :pagination="pagination"
            rowKey="id"
            :loading="loading"
            :scroll="{ x: 1200 }"
            size="small"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'patient_full_name'">
                <div class="flex items-center gap-2">
                  <a-avatar
                    :style="{
                      backgroundColor: '#E5EDFF',
                      color: '#2B4EFF',
                      fontWeight: '600',
                    }"
                  >
                    {{ record.patient_full_name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() }}
                  </a-avatar>
                  <span class="truncate">
                    {{ record.patient_full_name }}
                  </span>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'closed_date'">
                {{ record.closed_date ? dayjs(record.closed_date).format("DD.MM.YYYY") : "" }}
              </template>
              <template v-else-if="column.dataIndex === 'created_at'">
                {{ record.created_at ? dayjs(record.created_at).format("DD.MM.YYYY") : "" }}
              </template>
              <template v-else-if="column.key === 'Action'">
                <a-space size="small">
                <img class="w-[18px] cursor-pointer hover:opacity-70" src="../../assets/turn-left.png" @click="onReturn(record)" :title="$t('l_Return')" />
                </a-space>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- Reopen Modals -->
    <ReopenPregnancyModal
      :open="reopenPregnancyModalOpen"
      :patient-id="selectedPatientId"
      @update:open="reopenPregnancyModalOpen = $event"
      @success="handleReopenSuccess"
    />
    
    <ReopenKidModal
      :open="reopenKidModalOpen"
      :patient-id="selectedPatientId"
      @update:open="reopenKidModalOpen = $event"
      @success="handleReopenSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, h } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { ClosedApi } from "../../api/closed";
import dayjs from "dayjs";
//import type { TableRenderProps } from "../../types/table";
import ReopenPregnancyModal from "../pregnancy/ReopenCaseModal.vue";
import ReopenKidModal from "../kid/ReopenCaseModal.vue";

const { t: $t } = useI18n();

type ClosedCase = {
  id: string;
  case_number: string;
  patient_full_name: string;
  closed_date: string;
  closure_reason: string;
  created_at: string;
  updated_at: string;
};

const activeKey = ref('pregnant-women');
const search = ref("");
const currentFilters = ref<Record<string, any>>({});
const filtersOpen = ref(false);
const tableData = ref<ClosedCase[]>([]);
const loading = ref(false);

// Modal states
const reopenPregnancyModalOpen = ref(false);
const reopenKidModalOpen = ref(false);
const selectedPatientId = ref("");

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => $t("l_Total_records", { total }),
});

const pregnantColumns = [
  {
    title: "#",
    key: "index",
    width: 40,
    responsive: ["sm"],
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  {
    title: $t("l_Patient_full_name"),
    dataIndex: "patient_full_name",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_IIN"),
    dataIndex: "patient_iin",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_Birth_date"),
    dataIndex: "patient_birth_date",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_Closure_date"),
    dataIndex: "closed_date",
    width: 120,
    responsive: ["sm"],
  },
  {
    title: $t("l_Closure_by"),
    dataIndex: "closed_by_fullname",
    width: 150,
    responsive: ["md"],
    ellipsis: true,
  },
  {
    title: $t("l_Created_at"),
    dataIndex: "created_at",
    width: 120,
    responsive: ["md"],
  },
  {
    title: $t("l_Closure_reason"),
    dataIndex: "closure_note",
    width: 150,
    responsive: ["md"],
    ellipsis: true,
  },
  {
    title: $t("l_Actions"),
    key: "Action",
    width: 120,
    responsive: ["md"],
   
  },
];

const childrenColumns = [
  {
    title: "#",
    key: "index",
    width: 40,
    responsive: ["sm"],
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  {
    title: $t("l_Patient_full_name"),
    dataIndex: "patient_full_name",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_IIN"),
    dataIndex: "patient_iin",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_Birth_date"),
    dataIndex: "patient_birth_date",
    width: 200,
    ellipsis: true,
  },
  {
    title: $t("l_Closure_date"),
    dataIndex: "closed_date",
    width: 120,
    responsive: ["sm"],
  },
  {
    title: $t("l_Closure_by"),
    dataIndex: "closed_by_fullname",
    width: 150,
    responsive: ["md"],
    ellipsis: true,
  },
  {
    title: $t("l_Created_at"),
    dataIndex: "created_at",
    width: 120,
    responsive: ["md"],
  },
  {
    title: $t("l_Closure_reason"),
    dataIndex: "closure_note",
    width: 150,
    responsive: ["md"],
    ellipsis: true,
  },
  {
    title: $t("l_Actions"),
    key: "Action",
    width: 120,
    responsive: ["md"],
   
  },
];


const onTabChange = (key: string) => {
  activeKey.value = key;
  pagination.value.current = 1;
  fetchClosedCases();
};

const fetchClosedCases = async () => {
  loading.value = true;
  try {
    const queryParams: Record<string, any> = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    };
    
    if (search.value.trim()) queryParams.search = search.value.trim();
    
    if (Object.keys(currentFilters.value).length > 0) {
      const {
        closed_date_from,
        closed_date_to,
        ordering,
      } = currentFilters.value;

      if (closed_date_from) {
        queryParams.closed_date_from = String(closed_date_from);
      }
      if (closed_date_to) {
        queryParams.closed_date_to = String(closed_date_to);
      }
      if (ordering) {
        queryParams.ordering = String(ordering);
      }
    }

    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === "" || queryParams[key] == null)
        delete queryParams[key];
    });

    const { data } = await ClosedApi(activeKey.value, queryParams, "GET");
    tableData.value = data.items || data.results || [];
    pagination.value.total = data.total || data.count || 0;
  } catch (error) {
    // console.error('Error fetching closed cases:', error);
    // message.error($t("l_Failed_to_load_pregnant_list"));
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchClosedCases();
};

const applyFilters = () => {
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchClosedCases();
};

const resetFilters = () => {
  currentFilters.value = {};
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchClosedCases();
};

const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode?.parentElement || document.body;

onMounted(fetchClosedCases);

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(searchTimeout);
  if (!val) {
    fetchClosedCases();
  } else {
    pagination.value.current = 1;
    searchTimeout = setTimeout(fetchClosedCases, 300);
  }
});
const onReturn = (record: ClosedCase) => {
  selectedPatientId.value = record.id;
  if (activeKey.value === 'pregnant-women') {
    reopenPregnancyModalOpen.value = true;
  } else {
    reopenKidModalOpen.value = true;
  }
};

const handleReopenSuccess = () => {
  fetchClosedCases();
};

const downloadExcel = async () => {
  try {
    const response = await ClosedApi(`${activeKey.value}/download`, {}, "GET", {
      fileDownload: true,
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "kids_list.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    message.error($t("l_File_download_failed"));
  }
};
</script>

<style scoped>
.ant-page-header :deep(.ant-page-header-heading-title) {
  display: block;
}
@media (max-width: 1024px) {
  .ant-page-header :deep(.ant-page-header-heading-title) {
    display: none;
  }
}
.search-input :deep(.ant-input-search-button) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-input :deep(.ant-input-search-button .anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* Уменьшаем размеры шрифтов в таблице */
:deep(.ant-table) {
  font-size: 12px;
}

:deep(.ant-table-thead > tr > th) {
  font-size: 11px;
  font-weight: 600;
  padding: 8px 4px;
  line-height: 1.2;
}

:deep(.ant-table-tbody > tr > td) {
  font-size: 11px;
  padding: 6px 4px;
  line-height: 1.3;
}

/* Уменьшаем размеры аватаров */
:deep(.ant-avatar) {
  width: 24px !important;
  height: 24px !important;
  font-size: 10px !important;
  line-height: 24px !important;
}

/* Улучшаем мобильную адаптивность */
@media (max-width: 768px) {
  :deep(.ant-table) {
    font-size: 10px;
  }
  
  :deep(.ant-table-thead > tr > th) {
    font-size: 9px;
    padding: 4px 2px;
  }
  
  :deep(.ant-table-tbody > tr > td) {
    font-size: 9px;
    padding: 4px 2px;
  }
  
  :deep(.ant-avatar) {
    width: 20px !important;
    height: 20px !important;
    font-size: 8px !important;
    line-height: 20px !important;
  }
}

/* Разрешаем перенос текста в заголовках колонок */
:deep(.ant-table-thead > tr > th) {
  white-space: normal !important;
  word-wrap: break-word !important;
  line-height: 1.2 !important;
  padding: 8px 4px !important;
}
</style>