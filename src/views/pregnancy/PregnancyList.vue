<template>
  <div>
    <!-- Мобильный/планшетный заголовок -->
    <div class="block lg:hidden px-3 ">
      <span class="text-xl font-bold mb-2">{{ $t('l_Pregnant_women') }}</span>
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
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-[92vw] max-w-[420px]">
                
                <div>
                  <a-input-number style="width: 100%;"
                    v-model:value="currentFilters.pregnancy_weeks_min"
                    :placeholder="$t('l_Pregnancy_weeks_min')"
                    class="w-full"
                    :min="0"
                    :max="50"
                  />
                </div>
                <div>
                  <a-input-number style="width: 100%;"
                    v-model:value="currentFilters.pregnancy_weeks_max"
                    :placeholder="$t('l_Pregnancy_weeks_max')"
                    class="w-full"
                    :min="0"
                    :max="50"
                  />
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.trimester"
                    :placeholder="$t('l_Trimester')"
                    allowClear
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="1">1</a-select-option>
                    <a-select-option value="2">2</a-select-option>
                    <a-select-option value="3">3</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.monitoring_week"
                    :placeholder="$t('l_Monitoring_week')"
                    allowClear
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="12">12</a-select-option>
                    <a-select-option value="32">32</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-select
                    v-model:value="currentFilters.has_risk"
                    :placeholder="$t('l_Risk_status')"
                    allowClear
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="true">{{ $t('l_Yes') }}</a-select-option>
                    <a-select-option value="false">{{ $t('l_No') }}</a-select-option>
                  </a-select>
                </div>
                <div class="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <a-button class="w-full sm:w-auto" @click="resetFilters">{{ $t('l_Reset') }}</a-button>
                  <a-button class="w-full sm:w-auto" type="primary" @click="applyFilters">{{ $t('l_Apply_filters') }}</a-button>
                </div>
              </div>
            </template>
            <a-button class="w-full sm:w-auto min-w-[150px]" type="primary" ghost>
              <span class="icon active material-symbols-outlined">filter_alt <span>{{ $t('l_Filter') }}</span></span>
            </a-button>
          </a-popover>

          <!-- Действия -->
          <a-button @click="downloadExcel" class="w-full sm:w-auto">📄 {{ $t('l_Download_excel') }}</a-button>
          <a-button class="w-full sm:w-auto" @click="downloadTemplate">
            <span class="ml-2">📄 {{ $t('l_Download_template') }}</span>
          </a-button>
          <a-button class="w-full sm:w-auto" @click="fileInput?.click()">
            <span class="material-symbols-outlined">upload <span class="ml-2">{{ $t('l_Upload_file') }}</span></span>
          </a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".csv, .xls, .xlsx"
            style="display: none"
            @change="handleFileUpload"
          />
          <a-button type="primary" class="w-full sm:w-auto" @click="onAdd">
            <span class="material-symbols-outlined">add <span class="ml-2">{{ $t('l_Add_pregnant') }}</span></span>
          </a-button>
        </div>
      </template>
    </a-page-header>

    <!-- Таблица -->
    <div class="table-wrapper">
      <a-table
        bordered
        :dataSource="tableData"
        :columns="columns"
        :pagination="pagination"
        rowKey="id"
        :loading="loading"
        :scroll="{ x: 'max-content' }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'full_name'">
            <span class="clickable-text" @click.stop="onOpenDetails(record.id)">
              {{ record.full_name }}
            </span>
          </template>

          <template v-else-if="column.key === 'Action'">
            <a-space>
              <img
                class="w-[25px] mr-4 cursor-pointer hover:opacity-70"
                src="../../assets/edit.png"
                @click.stop="onEdit(record)"
              />
              <a-popconfirm
                placement="leftBottom"
                title="Сіз расымен қолданушыны қайта қосқыңыз келеді ме?"
                :ok-text="$t('l_Yes')"
                :cancel-text="$t('l_No')"
                @confirm="onDelete(record.id)"
              >
                <img
                  class="w-[25px] cursor-pointer hover:opacity-70"
                  src="../../assets/delete.png"
                  @click.stop
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
      @close="detailVisible = false"
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
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import AddEditPregnant from "./AddEditPregnant.vue";
import PregnantDetail from "./PregnantDetail.vue";
import dayjs from "dayjs";
import type { TableRenderProps } from "../../types/table";
const { t: $t } = useI18n();

const detailVisible = ref(false);
const selectedId = ref<string | null>(null);
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
  organization_id: string;
  organization_name: string;
  monitoring_category: string;
  surveys_count: number;
  last_survey_date: string;
  current_risk_level: string;
  created_at: string;
  updated_at: string;
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
    width: 50,
    responsive: ["sm"],
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  {
    title: $t("l_Full_name"),
    dataIndex: "full_name",
    customRender: ({ text, record }: TableRenderProps<Pregnant>) =>
      h(
        "span",
        {
          class: "cursor-pointer hover:text-blue-600 underline transition",
          onClick: () => onOpenDetails(record.id),
        },
        text
      ),
  },
  { title: $t("l_IIN"), dataIndex: "iin", responsive: ["sm"] },
  {
    title: $t("l_Birth_date"),
    dataIndex: "birth_date",
    responsive: ["sm"],
    customRender: ({ text }: TableRenderProps<Pregnant>) =>
      text ? dayjs(text).format("DD.MM.YYYY") : "",
  },
  { title: $t("l_Pregnancy_weeks"), dataIndex: "pregnancy_weeks", responsive: ["md"] , width:"100px"},
  { title: $t("l_Address"), dataIndex: "address", responsive: ["lg"], ellipsis: true },
  { title: $t("l_Organization"), dataIndex: "organization_name", responsive: ["md"], ellipsis: true },
  {
    title: $t("l_Visit_date"),
    dataIndex: "visit_date",
    responsive: ["sm"],
    customRender: ({ text }: TableRenderProps<Pregnant>) =>
      text ? dayjs(text).format("DD.MM.YYYY") : "",
  },
  { title: $t("l_Actions"), key: "Action", width: 110, align: "center" },
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
    await PregnantApi("upload", formData, "POST", { fileUpload: true });
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
    if (Object.keys(currentFilters.value).length > 0)
      Object.assign(queryParams, currentFilters.value);
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
</style>
