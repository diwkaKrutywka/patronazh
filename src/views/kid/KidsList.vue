<template>
  <div>
    <!-- Заголовок и инструменты -->
    <a-page-header :title="$t('l_Kids')">
      <template #extra>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            style="width: 400px"
            class="search-input"
            @search="fetchKids"
            allowClear
          />
          <!-- В шапке extra -->
          <a-button @click="downloadTemplate">
            <span class="ml-2">📄 {{ $t("l_Download_template") }}</span>
          </a-button>

          <!-- Загрузка Excel -->
          <a-button type="primary" @click="fileInput?.click()">
            <span class="ml-2">{{ $t('l_Upload_file') }}</span>
          </a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".csv, .xls, .xlsx"
            style="display: none"
            @change="handleFileUpload"
          />
          <!-- Добавить ребёнка -->
          <a-button type="primary" @click="onAddKid">
            <span class="material-symbols-outlined">
              add <span class="ml-2">{{ $t("l_Add_children") }}</span>
            </span>
          </a-button>
        </div>
      </template>
    </a-page-header>

    <!-- Таблица -->
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
            <img
              class="w-[25px] mr-4 cursor-pointer hover:opacity-70"
              src="../../assets/edit.png"
              @click="onEdit(record)"
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
              />
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Модалка добавления/редактирования -->
    <add-edit-kid
      v-model:open="modalVisible"
      :id="editingKid?.id"
      @submit="fetchKids"
    />

    <!-- Модалка деталей -->
    <kid-details
      :visible="detailsVisible"
      :id="selectedKid"
      @close="detailsVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { useGlobal } from "../../composables/useGlobal";
import { KidsApi } from "../../api/kids";
import type { TableRenderProps } from "../../types/table";
import AddEditKid from "./AddEditKid.vue";
import KidDetails from "./KidDetails.vue"; // 👈 новый компонент

const { t: $t } = useI18n();

type Kid = {
  id: string;
  iin: string;
  full_name: string;
  birth_date: string;
  gender: string;
  address: string;
  organization: string;
  age_months: number;
  created_at: string;
  updated_at: string;
};

const search = ref("");
const currentFilters = ref<Record<string, any>>({});
const tableData = ref<Kid[]>([]);
const loading = ref(false);

const modalVisible = ref(false);
const editingKid = ref<Kid | null>(null);

const detailsVisible = ref(false);
const selectedKid = ref<string | null>(null);

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

const onOpenDetails = (id: string) => {
  selectedKid.value = id;
  detailsVisible.value = true;
  console.log(selectedKid)
};

const columns = [
  {
    title: "#",
    key: "index",
    width: "50px",
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  {
    title: $t("l_Full_name"),
    dataIndex: "full_name",
    customRender: ({ text, record }: TableRenderProps<Kid>) => {
      const initials = (text as string)
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return h("div", { class: "flex items-center gap-2" }, [
        h(
          Avatar,
          {
            style: {
              backgroundColor: "#E5EDFF",
              color: "#2B4EFF",
              fontWeight: "600",
            },
          },
          () => initials
        ),
        h(
          "span",
          {
            class: "cursor-pointer hover:text-blue-600 transition",
            onClick: () => onOpenDetails(record.id),
          },
          text
        ),
      ]);
    },
  },
  {
    title: $t("l_IIN"),
    dataIndex: "iin",
  },
  {
    title: $t("l_Birth_date"),
    dataIndex: "birth_date",
    customRender: ({ text }: TableRenderProps<Kid>) => {
      const { $formatIsoDate } = useGlobal();
      return $formatIsoDate(text);
    },
  },
  {
    title: $t("l_Gender"),
    dataIndex: "gender",
    customRender: ({ text }: TableRenderProps<Kid>) => {
      const genderLower = String(text).toLowerCase();
      if (genderLower === "male")
        return h(Tag, { color: "blue" }, () => $t("l_Male"));
      if (genderLower === "female")
        return h(Tag, { color: "pink" }, () => $t("l_Female"));
      return h(Tag, { color: "gray" }, () => $t("l_Other"));
    },
  },
  {
    title: $t("l_Address"),
    dataIndex: "address",
  },
  {
    title: $t("l_Organization"),
    dataIndex: "organization_name",
  },
  {
    title: $t("l_Age_months"),
    dataIndex: "age_months",
  },
  {
    title: $t("l_Actions"),
    key: "Action",
    width: 110,
    align: "center",
  },
];

const onAddKid = () => {
  editingKid.value = null;
  modalVisible.value = true;
};

const onDelete = async (id: string) => {
  try {
    await KidsApi(`${id}/`, {}, "DELETE");
    message.success($t("l_Delete_success"));
    fetchKids();
  } catch {
    message.error($t("l_Delete_failed"));
  }
};

const downloadTemplate = async () => {
  try {
    const response = await KidsApi("template", {}, "GET", {
      fileDownload: true,
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "children_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    message.error($t("l_File_download_failed"));
    console.error(error);
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
    await KidsApi("upload", formData, "POST", { fileUpload: true });
    message.success($t("l_File_upload_success"));
    fetchKids();
  } catch (error) {
    message.error($t("l_File_upload_failed"));
    console.error(error);
  } finally {
    loading.value = false;
    target.value = "";
  }
};

const fetchKids = async () => {
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

    const { data } = await KidsApi<{ items: Kid[]; total: number }>(
      "",
      queryParams,
      "GET"
    );

    tableData.value = data.items;
    pagination.value.total = data.total;
  } catch (error) {
    message.error("Не удалось загрузить список детей");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchKids();
};

const onEdit = (record: Kid) => {
  editingKid.value = record;
  modalVisible.value = true;
};

onMounted(fetchKids);

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (newValue) => {
  clearTimeout(searchTimeout);
  if (!newValue) {
    fetchKids();
  } else {
    pagination.value.current = 1;
    searchTimeout = setTimeout(fetchKids, 300);
  }
});
</script>

<style scoped>
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
