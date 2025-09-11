<template>
  <a-drawer
    :visible="visible"
    :title="$t('l_Pregnant_women')"
    placement="right"
    :width="drawerWidth"
    @close="$emit('close')"
  >
    <!-- Основная информация -->
    <a-descriptions
      bordered
      :column="1"
      size="small"
      v-if="data"
      layout="horizontal"
    >
      <a-descriptions-item :label="$t('l_Full_name')"><a-tag color="green">{{
        data.full_name
      }}</a-tag></a-descriptions-item>
      <a-descriptions-item :label="$t('l_IIN')"><a-tag color="gray">{{
        data.iin
      }}</a-tag></a-descriptions-item>
      <a-descriptions-item :label="$t('l_Birth_date')">{{
        data.birth_date
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Visit_date')">{{
        data.visit_date
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Pregnancy_weeks')"><a-tag color="blue">{{
        data.pregnancy_weeks
      }}</a-tag></a-descriptions-item>
      <a-descriptions-item :label="$t('l_Due_date_12_weeks')">{{
        data.due_date_12_weeks
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Due_date_32_weeks')">{{
        data.due_date_32_weeks
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Address')">{{
        data.address
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Organization')">{{
        data.organization_name
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Monitoring_category')">{{
        data.monitoring_category
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Created_at')">
        {{ $formatIsoDate(data.created_at) }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('l_Updated_at')">
        {{ $formatIsoDate(data.updated_at) }}
      </a-descriptions-item>
    </a-descriptions>

    <div v-else class="text-center py-5"><a-spin /> {{ $t("l_Loading") }}</div>

    <!-- Список анкет -->
    <template v-if="data">
      <div class="flex justify-between items-center mt-10 mb-2 p-4 bg-gray-200 flex-col sm:flex-row gap-3">
        <h3>{{ $t("l_Surveys") }}</h3>
        <a-button type="primary" class="w-full sm:w-auto" @click="onAddSurvey">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> {{ $t("l_Add_survey") }}</span>
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
          :scroll="{ x: 'max-content' }"
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
    </template>

    <!-- Модалка добавления анкеты -->
    <AddEditSurvey
      v-model:open="surveyModalVisible"
      :pregnantWomanId="props.id"
      :surveyId="editingSurveyId"
      @success="fetchSurveys"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import { SurveysApi } from "../../api/survey";

import { message } from "ant-design-vue";
import { h } from "vue";
import AddEditSurvey from "./AddEditSurvey.vue";
import { useGlobal } from "../../composables/useGlobal"; // путь поправь

const { t: $t } = useI18n();
const { $formatIsoDate } = useGlobal();

const props = defineProps({
  visible: { type: Boolean, required: true },
  id: { type: String, default: null }
});const emit = defineEmits(["close"]);

const data = ref<any>(null);
// Responsive drawer width
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const onResize = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));
const drawerWidth = computed(() => {
  if (windowWidth.value < 480) return '100%';
  if (windowWidth.value < 768) return '90%';
  if (windowWidth.value < 1024) return '70%';
  return 800;
});
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
const onDelete = async (id: string) => {
  try {
    await SurveysApi(`pregnant-women/${id}/`, {}, "DELETE");
    message.success($t("l_Delete_success"));
    fetchSurveys();
  } catch {
    message.error($t("l_Delete_failed"));
  }
};
const surveyColumns = [
  {
    title: "#",
    key: "index",
    width: 50,
    customRender: ({ index }: { index: number }) =>
      (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
  },
  { title: $t("l_Fill_date"), dataIndex: "fill_date" },
  // { title: $t("l_IIN"), dataIndex: "woman_iin" },
  // { title: $t("l_Name"), dataIndex: "woman_name" },
  // { title: $t("l_Pregnancy_weeks"), dataIndex: "pregnancy_weeks", width:"100px" },
  // { title: $t("l_Organization"), dataIndex: "organization_name" },
  { title: $t("l_Total_score"), dataIndex: "total_score", width:"100px" },
  { title: $t("l_Max_score"), dataIndex: "max_score", width:"100px" },
  {
    title: $t("l_Risk_level"),
    dataIndex: "risk_level",
    customRender: ({ record }: { record: any }) => {
      return h(
        "span",
        { style: { color: record.risk_color } },
        record.risk_level
      );
    },
  },

  { title: $t("l_Actions"), key: "Action", width: 110, align: "center" },
];
const editingSurveyId = ref<string>();

const onEdit = (record: any) => {
  editingSurveyId.value = record.id;
  surveyModalVisible.value = true;
};

const fetchSurveys = async () => {
  if (!props.id) return;
  loadingSurveys.value = true;
  try {
    const { data } = await SurveysApi(
      `pregnant-women/`,
      {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
        pregnant_woman: `${props.id}`,
      },
      "GET"
    );
    surveys.value = data.items;
    pagination.value.total = data.total;
  } finally {
    loadingSurveys.value = false;
  }
};

const onAddSurvey = () => {
  surveyModalVisible.value = true;
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchSurveys();
};

// ======== Загрузка данных беременной ========
watch(
  () => props.id,
  async (newId) => {
    if (props.visible && newId) {
      data.value = null;
      try {
        const { data: res } = await PregnantApi(`${newId}/`, {}, "GET");
        data.value = res;
        fetchSurveys();
      } catch {
        message.error($t("l_Failed_to_load_pregnant_details"));
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
