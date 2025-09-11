<template>
  <a-drawer
    :visible="visible"
    :title="$t('l_Kids')"
    placement="right"
    :width="drawerWidth"
    @close="$emit('close')"
  >
    <!-- Основная информация о ребёнке -->
    <a-descriptions
      bordered
      :column="1"
      size="small"
      v-if="data"
      layout="horizontal"
    >
      <a-descriptions-item :label="$t('l_Full_name')">
       <a-tag color="green">{{ data.full_name }}</a-tag> 
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_IIN')">
       <a-tag color="gray">{{ data.iin }}</a-tag> 
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Birth_date')">
        {{ data.birth_date }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Gender')">
        {{ data.gender }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Age_months')">
        {{ data.age_months }}
      </a-descriptions-item>
      <!-- <a-descriptions-item :label="$t('l_Age_category')">
        {{ data.age_category }}
      </a-descriptions-item> -->
      <a-descriptions-item :label="$t('l_Address')">
        {{ data.address }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Phone_number')">
        {{ data.phone_number }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Organization')">
        {{ data.organization_name }}
      </a-descriptions-item>
      <!-- <a-descriptions-item :label="$t('l_Surveys_count')">
        {{ data.surveys_count }}
      </a-descriptions-item> -->
      <!-- <a-descriptions-item :label="$t('l_Visit_date')">
        {{ data.last_survey_date }}
      </a-descriptions-item> -->
      <a-descriptions-item :label="$t('l_Risk_level')">
       <a-tag color="blue">{{ data.current_risk_level }}</a-tag> 
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Created_at')">
  {{ $formatIsoDate(data.created_at) }}
</a-descriptions-item>
<a-descriptions-item :label="$t('l_Updated_at')">
  {{ $formatIsoDate(data.updated_at) }}
</a-descriptions-item>

    </a-descriptions>

   

    <!-- Список анкет -->
    <template v-if="data">
      <div class="flex justify-between items-center mt-10 mb-2 p-4 bg-gray-200">
        <h3>{{ $t("l_Surveys") }}</h3>
        <a-button type="primary" @click="onAddSurvey()">
          <span class="material-symbols-outlined">
            add <span class="ml-2">{{ $t("l_Add_survey") }}</span>
          </span>
        </a-button>
      </div>

      <div class="table-wrapper">
        <a-table
          :dataSource="surveys"
          :columns="surveyColumns"
          rowKey="id"
          size="small"
          :loading="loadingSurveys"
          :pagination="pagination"
          @change="handleTableChange"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Action'">
              <a-space>
                <img
                  class="w-[25px] mr-4"
                  src="../../assets/edit.png"
                  @click.stop="onEdit(record)"
                />
                <a-popconfirm
                  placement="leftBottom"
                  title="Сіз расымен анкетаны өшіргіңіз келеді ме?"
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
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </template>

    <!-- Модалка добавления анкеты -->
    <AddEditSurvey
      v-model:open="surveyModalVisible"
      :childId="props.id"
      :surveyId="editingSurveyId"
      @success="fetchSurveys"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, h, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { KidsApi } from "../../api/kids";
import { SurveysApi } from "../../api/survey";
import AddEditSurvey from "./AddEditSurvey.vue";
import { useGlobal } from "../../composables/useGlobal"; // путь поправь

const { t: $t } = useI18n();
const { $formatIsoDate } = useGlobal();

const props = defineProps({
  visible: { type: Boolean, required: true },
  id: { type: String, default: null }
});const emit = defineEmits(["close"]);

const data = ref<any>(null);

// ======== Responsive settings ========
const windowWidth = ref<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

const isMobile = computed(() => windowWidth.value < 640);
const isTablet = computed(() => windowWidth.value >= 640 && windowWidth.value < 1024);

const drawerWidth = computed<string | number>(() => {
  if (isMobile.value) return "100%";
  if (isTablet.value) return 640;
  return 800;
});


// ======== Пагинация ========
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => $t("l_Total_records", { total }),
});

// ======== Список анкет ========
const surveys = ref([]);
const loadingSurveys = ref(false);
const surveyModalVisible = ref(false);
const editingSurveyId = ref<string>();

const surveyColumns = [
  {
    title: "#",
    key: "index",
    width: 50,
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  { title: $t("l_Fill_date"), dataIndex: "fill_date" },
  // { title: $t("l_IIN"), dataIndex: "child_iin" },
  // { title: $t("l_Name"), dataIndex: "child_name" },
  // { title: $t("l_Organization"), dataIndex: "organization_name" },
  { title: $t("l_Total_score"), dataIndex: "total_score" },
  { title: $t("l_Max_score"), dataIndex: "max_score" },
  {
    title: $t("l_Risk_level"),
    dataIndex: "risk_level",
    customRender: ({ record }: { record: any }) =>
      h("span", { style: { color: record.risk_color } }, record.risk_level),
  },
  { title: $t("l_Actions"), key: "Action", width: 110, align: "center" },
];

const onAddSurvey = () => {
  editingSurveyId.value = undefined;
  surveyModalVisible.value = true;
};

const onEdit = (record: any) => {
  editingSurveyId.value = record.id;
  surveyModalVisible.value = true;
};

const onDelete = async (id: string) => {
  try {
    await SurveysApi(`children/${id}/`, {}, "DELETE");
    message.success($t("l_Delete_success"));
    fetchSurveys();
  } catch {
    message.error($t("l_Delete_failed"));
  }
};

const fetchSurveys = async () => {
  if (!props.id) return;
  loadingSurveys.value = true;
  try {
    const { data } = await SurveysApi(
      `children/`,
      {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
        child: `${props.id}`,
      },
      "GET"
    );
    surveys.value = data.items;
    pagination.value.total = data.total;
  } finally {
    loadingSurveys.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchSurveys();
};

// ======== Загрузка данных ребёнка ========
watch(
  () => props.id,
  async (newId) => {
    if (props.visible && newId) {
      data.value = null;
      try {
        const { data: res } = await KidsApi(`${newId}/`, {}, "GET");
        data.value = res;
       
        fetchSurveys();
      } catch {
        message.error($t("l_Failed_to_load_kid_details"));
      }
    }
  },
  { immediate: true }
);

watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) {
      data.value = null;
      surveys.value = [];
    }
  }
);
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}
</style>
