<template>
  <div>
    <!-- Мобильный/планшетный заголовок -->
    <div class="block lg:hidden px-3">
      <span class="text-xl font-bold mb-2">{{ $t("l_Pregnant_women") }}</span>
    </div>
    <a-page-header :title="$t('l_Pregnant_women')">
      <template #extra>
        <div
          class="flex flex-wrap gap-3 w-full flex-col sm:flex-row items-stretch sm:items-center sm:justify-end"
        >
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            class="search-input w-full sm:w-[400px]"
            @search="fetchPregnantWomen"
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
                  <a-input-number
                    style="width: 100%"
                    v-model:value="currentFilters.pregnancy_weeks_min"
                    :placeholder="$t('l_Pregnancy_weeks_min')"
                    class="w-full"
                    :min="3"
                    :max="50"
                    size="small"
                  />
                </div>
                <div>
                  <a-input-number
                    style="width: 100%"
                    v-model:value="currentFilters.pregnancy_weeks_max"
                    :placeholder="$t('l_Pregnancy_weeks_max')"
                    class="w-full"
                    size="small"
                    :min="3"
                    :max="50"
                  />
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.monitoring_category"
                    :placeholder="$t('l_Monitoring_category')"
                    allowClear
                      size="small"
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="universal"
                      >Универсальный</a-select-option
                    >
                    <a-select-option value="progressive"
                      >Прогрессивный</a-select-option
                    >
                  </a-select>
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.has_risk"
                    :placeholder="$t('l_Risk_status')"
                    allowClear
                    size="small"
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="true">{{
                      $t("l_Yes")
                    }}</a-select-option>
                    <a-select-option value="false">{{
                      $t("l_No")
                    }}</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.has_surveys"
                    :placeholder="$t('l_Has_surveys')"
                    allowClear
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="true">{{
                      $t("l_Yes")
                    }}</a-select-option>
                    <a-select-option value="false">{{
                      $t("l_No")
                    }}</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.visit_status_color"
                    mode="multiple"
                    :placeholder="$t('l_Visit_status_color')"
                    allowClear
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="RED">{{ $t('l_RED') }}</a-select-option>
                    <a-select-option value="YELLOW">{{ $t('l_YELLOW') }}</a-select-option>
                    <a-select-option value="PURPLE">{{ $t('l_PURPLE') }}</a-select-option>
                    <a-select-option value="GREEN">{{ $t('l_GREEN') }}</a-select-option>
                  </a-select>
                </div>
                <div class="sm:col-span-2">
                  <a-range-picker
                    v-model:value="currentFilters.no_surveys_range"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="[
                      $t('l_No_surveys_from'),
                      $t('l_No_surveys_to'),
                    ]"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div>
                <div class="sm:col-span-2">
                  <a-range-picker
                    v-model:value="currentFilters.survey_date_range"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="[
                      $t('l_Survey_date_from'),
                      $t('l_Survey_date_to'),
                    ]"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div>
                <div
                  class="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end"
                >
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

          <!-- Действия -->
          <a-button @click="downloadExcel" class="w-full sm:w-auto"
            >📄 {{ $t("l_Download_excel") }}</a-button
          >
          <a-button class="w-full sm:w-auto" @click="downloadTemplate">
            <span class="ml-2">📄 {{ $t("l_Download_template") }}</span>
          </a-button>
          <a-button class="w-full sm:w-auto" @click="fileInput?.click()">
            <span class="material-symbols-outlined"
              >upload <span class="ml-2">{{ $t("l_Upload_file") }}</span></span
            >
          </a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".csv, .xls, .xlsx"
            style="display: none"
            @change="handleFileUpload"
          />
          <a-button type="primary" class="w-full sm:w-auto" @click="onAdd">
            <span class="material-symbols-outlined"
              >add <span class="ml-2">{{ $t("l_Add_pregnant") }}</span></span
            >
          </a-button>
        </div>
      </template>
    </a-page-header>

    <!-- Легенда статусов визитов -->
    <div class="mb-4 p-3 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-semibold mb-2">{{ $t("l_Visit_status_legend") }}</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: rgb(255, 234, 236); border: 1px solid #ff4d4f;"></div>
          <span><strong>{{ $t("l_RED") }}</strong> - {{ $t("l_RED_description") }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: rgb(255, 251, 230); border: 1px solid #faad14;"></div>
          <span><strong>{{ $t("l_YELLOW") }}</strong> - {{ $t("l_YELLOW_description") }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: rgb(243, 240, 255); border: 1px solid #722ed1;"></div>
          <span><strong>{{ $t("l_PURPLE") }}</strong> - {{ $t("l_PURPLE_description") }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: rgb(246, 255, 237); border: 1px solid #52c41a;"></div>
          <span><strong>{{ $t("l_GREEN") }}</strong> - {{ $t("l_GREEN_description") }}</span>
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-wrapper">
      <a-table
        bordered
        :dataSource="tableData"
        :columns="columns"
        :pagination="pagination"
        rowKey="id"
        :loading="loading"
        :scroll="{ x: 1200 }"
        :customRow="customRow"
        size="small"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'full_name'">
            <div class="flex items-center gap-2">
              <a-avatar
                :style="{
                  backgroundColor: '#E5EDFF',
                  color: '#2B4EFF',
                  fontWeight: '600',
                }"
              >
                {{ record.full_name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() }}
              </a-avatar>
              <span 
                class="cursor-pointer hover:text-blue-600 underline transition" 
                @click.stop="onOpenDetails(record.id)"
              >
                {{ record.full_name }}
              </span>
            </div>
          </template>

          <template v-else-if="column.key === 'Action'">
            <a-space size="small">
              <img
                class="w-[18px] cursor-pointer hover:opacity-70"
                src="../../assets/edit.png"
                @click.stop="onEdit(record)"
                :title="$t('l_Edit')"
              />
              <a-popconfirm
                placement="leftBottom"
                :title="$t('l_Delete_user_confirmation')"
                :ok-text="$t('l_Yes')"
                :cancel-text="$t('l_No')"
                @confirm="onDelete(record.id)"
              >
                <img
                  class="w-[18px] cursor-pointer hover:opacity-70"
                  src="../../assets/delete.png"
                  @click.stop
                  :title="$t('l_Delete')"
                />
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Модальные окна -->
    <PregnantDetail
      :visible="detailVisible"
      :id="selectedId"
      @close="detailVisible = false; fetchPregnantWomen()"
    />
    <add-edit-pregnant
      v-model:open="modalVisible"
      :id="editingRecord?.id"
      @submit="fetchPregnantWomen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, h } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import AddEditPregnant from "./AddEditPregnant.vue";
import PregnantDetail from "./PregnantDetail.vue";
import dayjs from "dayjs";
import type { TableRenderProps } from "../../types/table";
const { t: $t } = useI18n();

const detailVisible = ref(false);
const selectedId = ref<string>();
const onOpenDetails = (id: string) => {
  selectedId.value = id;
  detailVisible.value = true;
};

type Pregnant = {
  id: string;
  iin: string;
  full_name: string;
  birth_date: string;
  visit_date: string;
  pregnancy_weeks: number;
  due_date_12_weeks: string;
  due_date_32_weeks: string;
  address: string;
  phone_number: string;
  organization_id: string;
  organization_name: string;
  monitoring_category: string;
  surveys_count: number;
  last_survey_date: string;
  current_risk_level: string;
  created_at: string;
  updated_at: string;
  visit_status?: {
    color: string;
    description: string;
  };
};

const search = ref("");
const currentFilters = ref<Record<string, any>>({});
const filtersOpen = ref(false);
const tableData = ref<Pregnant[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const editingRecord = ref<Pregnant | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => $t("l_Total_records", { total }),
});

const columns = [
  {
    title: "#",
    key: "index",
    width: 40,
    responsive: ["sm"],
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  {
    title: $t("l_Full_name"),
    dataIndex: "full_name",
    width: 200,
    ellipsis: true,
  },
  { 
    title: $t("l_IIN"), 
    dataIndex: "iin", 
    width: 120,
    responsive: ["sm"],
    ellipsis: true,
  },
  {
    title: $t("l_Birth_date"),
    dataIndex: "birth_date",
    width: 100,
    responsive: ["sm"],
    customRender: ({ text }: TableRenderProps<Pregnant>) =>
      text ? dayjs(text).format("DD.MM.YYYY") : "",
  },
  {
    title: $t("l_Pregnancy_weeks"),
    dataIndex: "pregnancy_weeks",
    width: 100,
    responsive: ["md"],
  },
  {
    title: $t("l_Address"),
    dataIndex: "address",
    width: 150,
    responsive: ["lg"],
    ellipsis: true,
  },

  {
    title: $t("l_Phone_number"),
    dataIndex: "phone_number",
    width: 120,
    responsive: ["sm"],
    ellipsis: true,
    customRender: ({ text }: TableRenderProps<Pregnant>) => {
      return h(Tag, { color: "blue" }, () => text || "-");
    },
  },
  {
    title: $t("l_Last_survey_date"),
    dataIndex: "last_survey_date",
    width: 100,
    responsive: ["md"],
    ellipsis: false,
    customRender: ({ text }: TableRenderProps<Pregnant>) => {
      if (text) {
        return h(Tag, { color: "green" }, () => text);
      }
      return "";
    },
  },
  {
    title: $t("l_Scheduled_next_visit_date"),
    dataIndex: "planned_next_visit_date",
    width: 100,
    responsive: ["md"],
    ellipsis: false,
    customRender: ({ text }: TableRenderProps<Pregnant>) => {
      if (text) {
        return h(Tag, { color: "green" }, () => text);
      }
      return "";
    },
  },
  {
    title: $t("l_Visit_date"),
    dataIndex: "visit_date",
    width: 100,
    responsive: ["sm"],
    customRender: ({ text }: TableRenderProps<Pregnant>) =>
      text ? dayjs(text).format("DD.MM.YYYY") : "",
  },
  {
    title: $t("l_Organization"),
    dataIndex: "organization_name",
    width: 120,
    responsive: ["md"],
    ellipsis: true,
  },
  { 
    title: $t("l_Actions"), 
    key: "Action", 
    width: 100, 
    align: "center",
    fixed: "right",
  },
];

const onAdd = () => {
  editingRecord.value = null;
  modalVisible.value = true;
};

const onDelete = async (id: string) => {
  try {
    await PregnantApi(`${id}/`, {}, "DELETE");
    message.success($t("l_Delete_success"));
    fetchPregnantWomen();
  } catch {
    message.error($t("l_Delete_failed"));
  }
};

const downloadTemplate = async () => {
  try {
    const response = await PregnantApi("template/", {}, "GET", {
      fileDownload: true,
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pregnant_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    message.error($t("l_File_download_failed"));
  }
};
const downloadExcel = async () => {
  try {
    const response = await PregnantApi("download/", {}, "GET", {
      fileDownload: true,
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pregnant_list.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    message.error($t("l_File_download_failed"));
  }
};
const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;
  const file = target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  try {
    loading.value = true;
    await PregnantApi("upload/", formData, "POST", { fileUpload: true });
    message.success($t("l_File_upload_success"));
    fetchPregnantWomen();
  } catch {
    message.error($t("l_File_upload_failed"));
  } finally {
    loading.value = false;
    target.value = "";
  }
};

const fetchPregnantWomen = async () => {
  loading.value = true;
  try {
    const queryParams: Record<string, any> = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    };
    if (search.value.trim()) queryParams.search = search.value.trim();
    if (Object.keys(currentFilters.value).length > 0) {
      const {
        pregnancy_weeks_min,
        pregnancy_weeks_max,
        monitoring_category,
        has_risk,
        has_surveys,
        no_surveys_range,
        survey_date_range,
      } = currentFilters.value;

      if (
        pregnancy_weeks_min !== undefined &&
        pregnancy_weeks_min !== null &&
        pregnancy_weeks_min !== ""
      ) {
        queryParams.pregnancy_weeks_min = Number(pregnancy_weeks_min);
      }
      if (
        pregnancy_weeks_max !== undefined &&
        pregnancy_weeks_max !== null &&
        pregnancy_weeks_max !== ""
      ) {
        queryParams.pregnancy_weeks_max = Number(pregnancy_weeks_max);
      }
      if (monitoring_category)
        queryParams.monitoring_category = String(monitoring_category);
      if (has_risk !== undefined && has_risk !== null && has_risk !== "") {
        queryParams.has_risk = String(has_risk) === "true";
      }
      if (
        has_surveys !== undefined &&
        has_surveys !== null &&
        has_surveys !== ""
      ) {
        queryParams.has_surveys = String(has_surveys) === "true";
      }
      if (
        no_surveys_range &&
        Array.isArray(no_surveys_range) &&
        no_surveys_range.length === 2
      ) {
        queryParams.no_surveys_from = String(no_surveys_range[0]);
        queryParams.no_surveys_to = String(no_surveys_range[1]);
      }
      if (
        survey_date_range &&
        Array.isArray(survey_date_range) &&
        survey_date_range.length === 2
      ) {
        queryParams.survey_date_from = String(survey_date_range[0]);
        queryParams.survey_date_to = String(survey_date_range[1]);
      }
      if (Array.isArray(currentFilters.value.visit_status_color) && currentFilters.value.visit_status_color.length > 0) {
        queryParams.visit_status_color = currentFilters.value.visit_status_color;
      }
    }
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === "" || queryParams[key] == null)
        delete queryParams[key];
    });
    const { data } = await PregnantApi("", queryParams, "GET");
    tableData.value = data.items;
    pagination.value.total = data.total;
  } catch {
    message.error($t("l_Failed_to_load_pregnant_list"));
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchPregnantWomen();
};

const onEdit = (record: Pregnant) => {
  editingRecord.value = record;
  modalVisible.value = true;
};

const applyFilters = () => {
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchPregnantWomen();
};

const resetFilters = () => {
  currentFilters.value = {};
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchPregnantWomen();
};

const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode?.parentElement || document.body;

const customRow = (record: Pregnant) => {
  const getRowStyle = () => {
    if (!record.visit_status?.color) return {};
    
    switch (record.visit_status.color) {
      case "RED":
        return { 
          backgroundColor: "#ffe0e0", 
          border: "5px solid white",
          '--hover-bg': '#ffb3b3'
        };
      case "YELLOW":
        return { 
          backgroundColor: "rgb(255, 251, 230)", 
          border: "5px solid white",
          '--hover-bg': '#fff2b3'
        };
      case "PURPLE":
        return { 
          backgroundColor: "rgb(243, 240, 255)", 
          border: "5px solid white",
          '--hover-bg': '#d9b3ff'
        };
      case "GREEN":
        return { 
          backgroundColor: "#e8ffe0", 
          border: "5px solid white",
          '--hover-bg': '#b3ffb3'
        };
      default:
        return {};
    }
  };
  
  return {
    style: getRowStyle(),
    class: `custom-table-row custom-${record.visit_status?.color?.toLowerCase() || 'default'}`
  };
};

onMounted(fetchPregnantWomen);

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(searchTimeout);
  if (!val) {
    fetchPregnantWomen();
  } else {
    pagination.value.current = 1;
    searchTimeout = setTimeout(fetchPregnantWomen, 300);
  }
});
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
.clickable-text {
  color: #1890ff;
  cursor: pointer;
}
.clickable-text:hover {
  text-decoration: underline;
  color: #40a9ff;
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

/* Уменьшаем размеры тегов */
:deep(.ant-tag) {
  font-size: 10px;
  padding: 2px 6px;
  margin: 0;
  line-height: 1.2;
}

/* Оптимизируем ширину колонок */
:deep(.ant-table-tbody > tr > td:nth-child(1)) {
  width: 40px;
  min-width: 40px;
}

:deep(.ant-table-tbody > tr > td:nth-child(2)) {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

:deep(.ant-table-tbody > tr > td:nth-child(3)) {
  width: 120px;
  min-width: 120px;
}

:deep(.ant-table-tbody > tr > td:nth-child(4)) {
  width: 100px;
  min-width: 100px;
}

:deep(.ant-table-tbody > tr > td:nth-child(5)) {
  width: 100px;
  min-width: 100px;
}

:deep(.ant-table-tbody > tr > td:nth-child(6)) {
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}

:deep(.ant-table-tbody > tr > td:nth-child(7)) {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

:deep(.ant-table-tbody > tr > td:nth-child(8)) {
  width: 120px;
  min-width: 120px;
}

:deep(.ant-table-tbody > tr > td:nth-child(9)) {
  width: 100px;
  min-width: 100px;
}

:deep(.ant-table-tbody > tr > td:nth-child(10)) {
  width: 100px;
  min-width: 100px;
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
  
  :deep(.ant-tag) {
    font-size: 8px;
    padding: 1px 4px;
  }
}

/* Уменьшаем размеры иконок действий */
:deep(.ant-table-tbody > tr > td img) {
  width: 18px !important;
  height: 18px !important;
}

@media (max-width: 768px) {
  :deep(.ant-table-tbody > tr > td img) {
    width: 16px !important;
    height: 16px !important;
  }
}

/* Исправляем hover эффекты для цветных строк */
:deep(.ant-table-tbody > tr.custom-table-row:hover > td) {
  background: var(--hover-bg) !important;
}

/* Принудительно сохраняем цвета строк после hover */
:deep(.ant-table-tbody > tr.custom-table-row > td) {
  background: inherit !important;
}

/* Убираем стандартный hover эффект Ant Design для цветных строк */
:deep(.ant-table-tbody > tr.custom-table-row:hover) {
  background: transparent !important;
}

:deep(.ant-table-tbody > tr.custom-table-row:hover > td) {
  background: var(--hover-bg) !important;
}

/* Увеличиваем ширину колонок для лучшего отображения названий */
:deep(.ant-table-thead > tr > th:nth-child(8)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-thead > tr > th:nth-child(9)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-tbody > tr > td:nth-child(8)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-tbody > tr > td:nth-child(9)) {
  width: 140px !important;
  min-width: 140px !important;
}

/* Разрешаем перенос текста в заголовках колонок */
:deep(.ant-table-thead > tr > th) {
  white-space: normal !important;
  word-wrap: break-word !important;
  line-height: 1.2 !important;
  padding: 8px 4px !important;
}

/* Принудительно сохраняем цвета для каждого типа строк */
:deep(.ant-table-tbody > tr.custom-red > td) {
  background-color: #ffe0e0 !important;
}

:deep(.ant-table-tbody > tr.custom-yellow > td) {
  background-color: rgb(255, 251, 230) !important;
}

:deep(.ant-table-tbody > tr.custom-purple > td) {
  background-color: rgb(243, 240, 255) !important;
}

:deep(.ant-table-tbody > tr.custom-green > td) {
  background-color: #e8ffe0 !important;
}

/* Hover эффекты для каждого типа */
:deep(.ant-table-tbody > tr.custom-red:hover > td) {
  background-color: #ffb3b3 !important;
}

:deep(.ant-table-tbody > tr.custom-yellow:hover > td) {
  background-color: #fff2b3 !important;
}

:deep(.ant-table-tbody > tr.custom-purple:hover > td) {
  background-color: #d9b3ff !important;
}

:deep(.ant-table-tbody > tr.custom-green:hover > td) {
  background-color: #b3ffb3 !important;
}
</style>
