<template>
  <div>
    <a-page-header :title="$t('l_Pregnant_women')">
      <template #extra>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            style="width: 250px"
            @search="fetchPregnantWomen"
            allowClear
          />

          <!-- Фильтр триместра -->
          <a-select
            v-model:value="filters.trimester"
            :placeholder="$t('l_Trimester')"
            style="width: 120px"
            allowClear
            @change="fetchPregnantWomen"
          >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>

          <!-- Фильтр недели мониторинга -->
          <a-select
            v-model:value="filters.monitoring_week"
            :placeholder="$t('l_Monitoring_week')"
            style="width: 150px"
            allowClear
            @change="fetchPregnantWomen"
          >
            <a-select-option value="12">12</a-select-option>
            <a-select-option value="32">32</a-select-option>
          </a-select>

          <!-- Фильтр риска -->
          <a-select
            v-model:value="filters.has_risk"
            :placeholder="$t('l_Risk_status')"
            style="width: 150px"
            allowClear
            @change="fetchPregnantWomen"
          >
            <a-select-option value="true">{{ $t('l_Yes') }}</a-select-option>
            <a-select-option value="false">{{ $t('l_No') }}</a-select-option>
          </a-select>

          <a-button @click="downloadTemplate">📄 {{ $t('l_Download_template') }}</a-button>
          <a-button type="primary" @click="fileInput?.click()">{{ $t('l_Upload_file') }}</a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".csv, .xls, .xlsx"
            style="display: none"
            @change="handleFileUpload"
          />
          <a-button type="primary" @click="onAdd">➕ {{ $t("l_Add_pregnant") }}</a-button>
        </div>
      </template>
    </a-page-header>

    <a-table
      bordered
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      rowKey="id"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'Action'">
          <a-space>
            <span class="icon material-symbols-outlined cursor-pointer" @click="onEdit(record)">edit</span>
            <span class="icon material-symbols-outlined cursor-pointer" @click="onDelete(record.id)">delete</span>
          </a-space>
        </template>
      </template>
    </a-table>

    <add-edit-pregnant
      v-model:open="modalVisible"
      :id="editingRecord?.id"
      @submit="fetchPregnantWomen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch } from "vue";
import { Avatar, message, Tag, Modal } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { useGlobal } from "../../composables/useGlobal";
import { PregnantApi } from "../../api/pregnancy";
import AddEditPregnant from "./AddEditPregnant.vue";

const { t: $t } = useI18n();

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
  organization_name: string;
  monitoring_category: string;
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
  { title: "#", key: "index", width: "50px",
    customRender: ({ index }: { index: number }) => (pagination.value.current - 1) * pagination.value.pageSize + index + 1
  },
  { title: $t("l_Full_name"), dataIndex: "full_name" },
  { title: $t("l_IIN"), dataIndex: "iin" },
  { title: $t("l_Birth_date"), dataIndex: "birth_date" },
  // { title: $t("l_Visit_date"), dataIndex: "visit_date" },
  { title: $t("l_Pregnancy_weeks"), dataIndex: "pregnancy_weeks" },
  // { title: $t("l_Due_date_12_weeks"), dataIndex: "due_date_12_weeks" },
  // { title: $t("l_Due_date_32_weeks"), dataIndex: "due_date_32_weeks" },
  { title: $t("l_Address"), dataIndex: "address" },
  { title: $t("l_Organization"), dataIndex: "organization_name" },
  { title: $t("l_Monitoring_category"), dataIndex: "monitoring_category" },
  { title: $t("l_Actions"), key: "Action", width: 110, align: "center" },
];

const onAdd = () => {
  editingRecord.value = null;
  modalVisible.value = true;
};

const onDelete = (id: string) => {
  Modal.confirm({
    title: $t("l_Confirm_delete_title"),
    content: $t("l_Confirm_delete"),
    okText: $t("l_Yes"),
    cancelText: $t("l_No"),
    async onOk() {
      try {
        await PregnantApi(`${id}/`, {}, "DELETE");
        message.success($t("l_Delete_success"));
        fetchPregnantWomen();
      } catch {
        message.error($t("l_Delete_failed"));
      }
    },
  });
};

const downloadTemplate = async () => {
  try {
    const response = await PregnantApi("template", {}, "GET", { fileDownload: true });
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

    // Поиск — строка
    if (search.value.trim()) {
      queryParams.search = search.value
    }

    // Фильтры
    Object.entries(filters.value).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        queryParams[key] = val;
      }
    });

    const { data } = await PregnantApi("", queryParams, "GET");
    tableData.value = data.items;
    pagination.value.total = data.total;
  } catch (error) {
    message.error($t("l_Failed_to_load_pregnant_list"));
    console.error(error);
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
watch(search, (newValue) => {
  clearTimeout(searchTimeout);
  if (!newValue) {
    fetchPregnantWomen();
  } else {
    pagination.value.current = 1;
    searchTimeout = setTimeout(fetchPregnantWomen, 300);
  }
});
</script>
