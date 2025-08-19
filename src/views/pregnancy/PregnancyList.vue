<template>
  <div>
    <a-page-header :title="$t('l_Pregnant_women')">
      <template #extra>
        <div class="header-actions">
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            class="search-input"
            @search="fetchPregnantWomen"
            allowClear
          />

          <!-- Кнопка для показа фильтров -->
          <a-button @click="showFilters = !showFilters">
            🔍 {{ $t("l_Filter") }}
          </a-button>

          <!-- Группа кнопок действий -->
          <div class="buttons-group">
            <a-button @click="downloadTemplate" class="action-btn"
              >📄 {{ $t("l_Download_template") }}</a-button
            >
            <a-button @click="downloadExcel" class="action-btn"
              >📄 {{ $t("l_Download_excel") }}</a-button
            >
            <a-button
              type="primary"
              @click="fileInput?.click()"
              class="action-btn"
              >{{ $t("l_Upload_file") }}</a-button
            >
            <input
              type="file"
              ref="fileInput"
              accept=".csv, .xls, .xlsx"
              style="display: none"
              @change="handleFileUpload"
            />
            <a-button type="primary" @click="onAdd" class="action-btn"
              >➕ {{ $t("l_Add_pregnant") }}</a-button
            >
          </div>
        </div>

        <!-- Блок фильтров -->
        <transition name="fade">
          <div v-if="showFilters" class="filters-panel">
            <a-select
              v-model:value="filters.trimester"
              :placeholder="$t('l_Trimester')"
              class="filter-select"
              allowClear
              @change="fetchPregnantWomen"
            >
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
            </a-select>

            <a-select
              v-model:value="filters.monitoring_week"
              :placeholder="$t('l_Monitoring_week')"
              class="filter-select"
              allowClear
              @change="fetchPregnantWomen"
            >
              <a-select-option value="12">12</a-select-option>
              <a-select-option value="32">32</a-select-option>
            </a-select>

            <a-select
              v-model:value="filters.has_risk"
              :placeholder="$t('l_Risk_status')"
              class="filter-select"
              allowClear
              @change="fetchPregnantWomen"
            >
              <a-select-option value="true">{{ $t("l_Yes") }}</a-select-option>
              <a-select-option value="false">{{ $t("l_No") }}</a-select-option>
            </a-select>
          </div>
        </transition>
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
        @change="handleTableChange"
        @rowClick="(record) => toDetail(record.id)"
        :rowClassName="() => 'clickable-row'"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'full_name'">
            <span class="clickable-text" @click.stop="toDetail(record.id)">
              {{ record.full_name }}
            </span>
          </template>

          <template v-else-if="column.key === 'Action'">
            <a-space>
              <img
                class="w-[25px] mr-4"
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
                  class="w-[25px]"
                  src="../../assets/delete.png"
                  @click.stop
                />
              </a-popconfirm>
              <!-- <img
                class="w-[15px]"
                src="../../assets/essay.png"
                @click.stop="toDetail(record.id)"
              /> -->
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
import { ref, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import AddEditPregnant from "./AddEditPregnant.vue";
import PregnantDetail from "./PregnantDetail.vue";
import dayjs from "dayjs"; // добавляем для форматирования дат
const { t: $t } = useI18n();

const showFilters = ref(false);
const detailVisible = ref(false);
const selectedId = ref<string | null>(null);
const toDetail = (id: string) => {
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
const filters = ref<Record<string, any>>({});
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
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  { title: $t("l_Full_name"), dataIndex: "full_name" },
  { title: $t("l_IIN"), dataIndex: "iin" },
  { title: $t("l_Birth_date"), dataIndex: "birth_date" },
  { title: $t("l_Pregnancy_weeks"), dataIndex: "pregnancy_weeks" },

  { title: $t("l_Address"), dataIndex: "address" },
  { title: $t("l_Organization"), dataIndex: "organization_name" },
  {
    title: $t("l_Visit_date"),
    dataIndex: "visit_date",
    customRender: ({ text }: { text: string }) =>
      text ? dayjs(text).format("DD.MM.YYYY") : "",
  },
  // { title: $t("l_Monitoring_category"), dataIndex: "monitoring_category" },
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
    link.setAttribute("download", "pregnant_template.csv");
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
    link.setAttribute("download", "pregnant_list.csv");
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
    if (search.value.trim()) queryParams.search = search.value;
    Object.entries(filters.value).forEach(([key, val]) => {
      if (val) queryParams[key] = val;
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
.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-input {
  width: 250px;
}

.filters-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.filter-select {
  width: 120px;
}

.buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  white-space: nowrap;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.clickable-row:hover {
  background-color: #f5f5f5;
}

.clickable-text {
  color: #1890ff;
  cursor: pointer;
}
.clickable-text:hover {
  text-decoration: underline;
  color: #40a9ff;
}

@media (max-width: 1024px) {
  .search-input {
    width: 100%;
  }
  .filter-select {
    width: 48%;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
  }
  .filters-panel {
    flex-direction: column;
  }
  .filter-select {
    width: 100%;
  }
  .buttons-group {
    flex-direction: column;
    width: 100%;
  }
  .action-btn {
    width: 100%;
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
</style>
