<template>
  <a-drawer
    :visible="visible"
    :title="$t('l_Pregnant_women')"
    placement="right"
    width="800"
    @close="$emit('close')"
  >
    <!-- Основная информация -->
    <a-descriptions
      bordered
      column="3"
      size="small"
      v-if="data"
      layout="vertical"
    >
      <a-descriptions-item :label="$t('l_Full_name')">{{
        data.full_name
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_IIN')">{{
        data.iin
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Birth_date')">{{
        data.birth_date
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Visit_date')">{{
        data.visit_date
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Pregnancy_weeks')">{{
        data.pregnancy_weeks
      }}</a-descriptions-item>
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
      <a-descriptions-item :label="$t('l_Created_at')">{{
        data.created_at
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('l_Updated_at')">{{
        data.updated_at
      }}</a-descriptions-item>
    </a-descriptions>

    <div v-else class="text-center py-5"><a-spin /> {{ $t("l_Loading") }}</div>

    <!-- Список анкет -->
    <template v-if="data">
      <div class="flex justify-between items-center mt-10 mb-2 p-4 bg-gray-200">
        <h3>{{ $t("l_Surveys") }}</h3>
        <a-button type="primary" @click="onAddSurvey">
          <span class="material-symbols-outlined"> add 
       <span class="ml-2"> {{ $t("l_Add_survey") }}</span> </span>
        </a-button>
      </div>
      <div class="table-wrapper">
        <a-table
          :dataSource="surveys"
          :columns="surveyColumns"
          rowKey="id"
          size="small"
          :loading="loadingSurveys"
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
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import { SurveysApi } from "../../api/survey";

import { message } from "ant-design-vue";
import { h } from "vue";
import AddEditSurvey from "./AddEditSurvey.vue";
const { t: $t } = useI18n();

const props = defineProps<{
  visible: boolean;
  id: string | null;
}>();

const emit = defineEmits(["close"]);

const data = ref<any>(null);
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
  { title: $t("l_IIN"), dataIndex: "woman_iin" },
  { title: $t("l_Name"), dataIndex: "woman_name" },
  { title: $t("l_Pregnancy_weeks"), dataIndex: "pregnancy_weeks" },
  { title: $t("l_Organization"), dataIndex: "organization_name" },
  { title: $t("l_Total_score"), dataIndex: "total_score" },
  { title: $t("l_Max_score"), dataIndex: "max_score" },
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
const editingSurveyId = ref<string | null>(null);

const onEdit = (record: any) => {
  editingSurveyId.value = record.id;
  surveyModalVisible.value = true;
};

const fetchSurveys = async () => {
  if (!props.id) return;
  loadingSurveys.value = true;
  try {
    const { data } = await SurveysApi(`pregnant-women/`, {  page: pagination.value.current,
      page_size: pagination.value.pageSize, pregnant_woman: `${props.id}`}, "GET");
    surveys.value = data.items;
  } finally {
    loadingSurveys.value = false;
  }
};

const onAddSurvey = () => {
  surveyModalVisible.value = true;
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
