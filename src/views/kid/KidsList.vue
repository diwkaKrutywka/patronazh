<template>
  <div>
    <!-- Мобильный/планшетный заголовок -->
    <div class="block lg:hidden px-3 ">
      <span class="text-xl font-bold mb-2">{{ $t("l_Kids") }}</span>
    </div>
    <!-- Заголовок и инструменты -->
    <a-page-header :title="$t('l_Kids')">
      <template #extra>
        <div
          class="flex flex-wrap gap-3 w-full flex-col sm:flex-row items-stretch sm:items-center sm:justify-end"
        >
          <!-- Поиск -->
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            class="search-input w-full sm:w-[400px]"
            @search="fetchKids"
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
                  <a-select
                    v-model:value="currentFilters.age_group"
                    :placeholder="$t('l_Age_group')"
                    allowClear
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                    size="small"
                  >
                    <a-select-option value="newborn">{{ $t('age_group_newborn') }}</a-select-option>
                    <a-select-option value="14_days">{{ $t('age_group_14_days') }}</a-select-option>
                    <a-select-option value="1_5_months">{{ $t('age_group_1_5_months') }}</a-select-option>
                    <a-select-option value="5_months">{{ $t('age_group_5_months') }}</a-select-option>
                    <a-select-option value="9_months">{{ $t('age_group_9_months') }}</a-select-option>
                    <a-select-option value="15_months">{{ $t('age_group_15_months') }}</a-select-option>
                    <a-select-option value="21_months">{{ $t('age_group_21_months') }}</a-select-option>
                    <a-select-option value="33_months">{{ $t('age_group_33_months') }}</a-select-option>
                  </a-select>
                </div>
               
                <!-- <div>
                  <a-input-number
                    v-model:value="currentFilters.age_min"
                    :placeholder="$t('l_Age_min')"
                    :min="0"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div>
                <div>
                  <a-input-number
                    v-model:value="currentFilters.age_max"
                    :placeholder="$t('l_Age_max')"
                    :min="0"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
                </div> -->
                <!-- <div>
                  <a-select
                    v-model:value="currentFilters.gender"
                    :placeholder="$t('l_Gender')"
                    allowClear
                    class="w-full"
                    :getPopupContainer="getPopupContainer"
                  >
                    <a-select-option value="male">{{
                      $t("l_Male")
                    }}</a-select-option>
                    <a-select-option value="female">{{
                      $t("l_Female")
                    }}</a-select-option>
                  </a-select>
                </div> -->
                <div>
                  <a-select
                    v-model:value="currentFilters.has_risk"
                    :placeholder="$t('l_Risk_status')"
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
               
                <div class="sm:col-span-2">
                  <a-range-picker
                    v-model:value="currentFilters.no_surveys_range"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="[$t('l_No_surveys_from'), $t('l_No_surveys_to')]"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
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
                    v-model:value="currentFilters.survey_date_range"
                    valueFormat="YYYY-MM-DD"
                    :placeholder="[$t('l_Survey_date_from'), $t('l_Survey_date_to')]"
                    class="w-full"
                    size="small"
                    :getPopupContainer="getPopupContainer"
                  />
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
                <div class="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <a-button size="small" class="w-full sm:w-auto" @click="resetFilters">{{ $t("l_Reset") }}</a-button>
                  <a-button size="small" class="w-full sm:w-auto" type="primary" @click="applyFilters">{{
                    $t("l_Apply_filters")
                  }}</a-button>
                </div>
              </div>
            </template>
            <a-button class="w-full sm:w-auto min-w-[150px]" type="primary" ghost
              ><span class="icon active material-symbols-outlined">
                filter_alt
                <span>{{ $t("l_Filter") }}</span></span
              >
            </a-button>
          </a-popover>
          <a-button @click="downloadExcel" class="w-full sm:w-auto"
            >📄 {{ $t("l_Download_excel") }}</a-button
          >
          <!-- В шапке extra -->
          <a-button class="w-full sm:w-auto" @click="downloadTemplate">
            <span class="ml-2">📄 {{ $t("l_Download_template") }}</span>
          </a-button>

          <!-- Загрузка Excel -->
          <a-button
           
            class="w-full sm:w-auto"
            @click="fileInput?.click()"
          >
          <span class="material-symbols-outlined">
upload
  <span class="ml-2">{{ $t("l_Upload_file") }}</span></span>
          </a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".csv, .xls, .xlsx"
            style="display: none"
            @change="handleFileUpload"
          />
          <!-- Добавить ребёнка -->
          <a-button type="primary" class="w-full sm:w-auto" @click="onAddKid">
            <span class="material-symbols-outlined">
              add <span class="ml-2">{{ $t("l_Add_children") }}</span>
            </span>
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
        <template v-if="column.key === 'Action'">
          <a-space size="small">
            <img
              class="w-[18px] cursor-pointer hover:opacity-70"
              src="../../assets/edit.png"
              @click="onEdit(record)"
              :title="$t('l_Edit')"
            />

            <a-popconfirm
              placement="leftBottom"
              :title="$t('l_Delete_confirmation')"
              :ok-text="$t('l_Yes')"
              :cancel-text="$t('l_No')"
              @confirm="onDelete(record.id)"
            >
              <img
                class="w-[18px] cursor-pointer hover:opacity-70"
                src="../../assets/delete.png"
                :title="$t('l_Delete')"
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
      @close="detailsVisible = false; fetchKids()"
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

const { t: $t, locale } = useI18n();

type Kid = {
  id: string;
  iin: string;
  full_name: string;
  birth_date: string;
  gender: string;
  address: string;
  organization: string;
  phone_number: string;
  age_months: number;
  created_at: string;
  updated_at: string;
  visit_status?: {
    color: string;
    description: string;
  };
};

const search = ref("");
const currentFilters = ref<Record<string, any>>({});
const tableData = ref<Kid[]>([]);
const loading = ref(false);

const modalVisible = ref(false);
const editingKid = ref<Kid | null>(null);

const detailsVisible = ref(false);
const selectedKid = ref<string>();

const fileInput = ref<HTMLInputElement | null>(null);
const filtersOpen = ref(false);

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
  console.log(selectedKid);
};
const downloadExcel = async () => {
  try {
    const response = await KidsApi("download/", {}, "GET", {
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
    customRender: ({ text, record }: TableRenderProps<Kid>) => {
      const initials = (text as string)
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return h("div", { class: "flex items-center gap-1" }, [
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
            class: "cursor-pointer hover:text-blue-600 underline transition truncate",
            onClick: () => onOpenDetails(record.id),
            title: text,
          },
          text
        ),
      ]);
    },
  },
  {
    title: $t("l_Has_risk"),
    dataIndex: "is_in_progressive_package",
    width: 60,
    responsive: ["sm"],
    ellipsis: true,
    customRender: ({ text }: TableRenderProps<Kid>) => {
      return h(Tag, { color: text ? "red" : "gray" }, () => text ? $t("l_Yes") : $t("l_No"));
    },
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
    customRender: ({ text }: TableRenderProps<Kid>) => {
      const { $formatIsoDate } = useGlobal();
      return $formatIsoDate(text);
    },
  },
  {
    title: $t("l_Gender"),
    dataIndex: "gender",
    width: 80,
    responsive: ["md"],
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
    customRender: ({ text }: TableRenderProps<Kid>) => {
      return h(Tag, { color: "blue" }, () => text || "-");
    },
  },
  {
    title: $t("l_Age_months"),
    dataIndex: "age_months",
    width: 80,
    responsive: ["md"],
  },
  {
    title: $t("l_Last_survey_date"),
    dataIndex: "last_survey_date",
    width: 100,
    responsive: ["md"],
    ellipsis: false,
    customRender: ({ text }: TableRenderProps<Kid>) => {
      if (text) {
        return h(Tag, { color: "green" }, () => text);
      }
      return "";
    },
  },
  {
    title: $t("l_Scheduled_next_visit_date"),
    dataIndex: "upcoming_key_date",
    width: 100,
    responsive: ["md"],
    ellipsis: false,
    customRender: ({ text }: TableRenderProps<Kid>) => {
      if (text) {
        return h(Tag, { color: "green" }, () => text.week_range?text.week_range.start+" - "+text.week_range.end:text.date);
      }
      return "";
    },
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
    const response = await KidsApi("template/", {}, "GET", {
      fileDownload: true,
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "children_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
  
    console.error(error);
  }
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // Получаем текущий язык
  const currentLocale = locale.value;

  try {
    loading.value = true;
    const response = await KidsApi("upload/", formData, "POST", { fileUpload: true });
    
    // Определяем сообщение в зависимости от языка
    let successMessage = $t("l_File_upload_success");
    if (response.data) {
      if (currentLocale === 'ru' && response.data.message_ru) {
        successMessage = response.data.message_ru;
      } else if (currentLocale === 'kk' && response.data.message_kz) {
        successMessage = response.data.message_kz;
      } else if (response.data.message) {
        successMessage = response.data.message;
      }
    }
    
    message.success(successMessage);
    fetchKids();
  } catch (error: any) {
    let errorMessage = $t("l_File_upload_failed");
    if (error?.response?.data) {
      if (currentLocale === 'ru' && error.response.data.message_ru) {
        errorMessage = error.response.data.message_ru;
      } else if (currentLocale === 'kk' && error.response.data.message_kz) {
        errorMessage = error.response.data.message_kz;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }
    
    message.error(errorMessage);
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
    if (Object.keys(currentFilters.value).length > 0) {
      const {
        age_group,
        age_min,
        age_max,
        gender,
        has_risk,
        has_surveys,
        no_surveys_range,
        survey_date_range,
      } = currentFilters.value;

      if (age_group) queryParams.age_group = String(age_group);
      if (age_min !== undefined && age_min !== null && age_min !== '') {
        queryParams.age_min = Number(age_min);
      }
      if (age_max !== undefined && age_max !== null && age_max !== '') {
        queryParams.age_max = Number(age_max);
      }
      if (gender) queryParams.gender = gender;
      if (has_risk !== undefined && has_risk !== null && has_risk !== '') {
        queryParams.has_risk = String(has_risk) === 'true';
      }
      if (has_surveys !== undefined && has_surveys !== null && has_surveys !== '') {
        queryParams.has_surveys = String(has_surveys) === 'true';
      }
      if (Array.isArray(currentFilters.value.visit_status_color) && currentFilters.value.visit_status_color.length > 0) {
        queryParams.visit_status_color = currentFilters.value.visit_status_color;
      }
      if (no_surveys_range && Array.isArray(no_surveys_range) && no_surveys_range.length === 2) {
        queryParams.no_surveys_from = String(no_surveys_range[0]);
        queryParams.no_surveys_to = String(no_surveys_range[1]);
      }
      if (survey_date_range && Array.isArray(survey_date_range) && survey_date_range.length === 2) {
        queryParams.survey_date_from = String(survey_date_range[0]);
        queryParams.survey_date_to = String(survey_date_range[1]);
      }
    }

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
    message.error($t("l_Failed_to_load_kids_list"));
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

const applyFilters = () => {
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchKids();
};

const resetFilters = () => {
  currentFilters.value = {};
  pagination.value.current = 1;
  filtersOpen.value = false;
  fetchKids();
};

const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode?.parentElement || document.body;

const customRow = (record: Kid) => {
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
.ant-page-header :deep(.ant-page-header-heading-title) {
  /* По умолчанию показываем заголовок внутри PageHeader */
  display: block;
}
@media (max-width: 1024px) {
  .ant-page-header :deep(.ant-page-header-heading-title) {
    /* На мобильных и планшетах скрываем встроенный заголовок,
       используем кастомный сверху */
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
  width: 80px;
  min-width: 80px;
}

:deep(.ant-table-tbody > tr > td:nth-child(6)) {
  width: 150px;
  min-width: 150px;
  max-width: 150px;
}

:deep(.ant-table-tbody > tr > td:nth-child(7)) {
  width: 120px;
  min-width: 120px;
}

:deep(.ant-table-tbody > tr > td:nth-child(8)) {
  width: 80px;
  min-width: 80px;
}

:deep(.ant-table-tbody > tr > td:nth-child(9)) {
  width: 100px;
  min-width: 100px;
}

:deep(.ant-table-tbody > tr > td:nth-child(10)) {
  width: 100px;
  min-width: 100px;
}

:deep(.ant-table-tbody > tr > td:nth-child(11)) {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

:deep(.ant-table-tbody > tr > td:nth-child(12)) {
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
:deep(.ant-table-thead > tr > th:nth-child(9)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-thead > tr > th:nth-child(10)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-tbody > tr > td:nth-child(9)) {
  width: 140px !important;
  min-width: 140px !important;
}

:deep(.ant-table-tbody > tr > td:nth-child(10)) {
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
