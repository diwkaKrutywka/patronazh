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
          ➕ {{ $t("l_Add_survey") }}
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
        />
      </div>
    </template>

    <!-- Модалка добавления анкеты -->
    <AddEditSurvey
      v-model:open="surveyModalVisible"
      :pregnantWomanId="props.id"
      @success="fetchSurveys"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PregnantApi } from "../../api/pregnancy";
import { message } from "ant-design-vue";

import AddEditSurvey from "./AddEditSurvey.vue";
const { t: $t } = useI18n();

const props = defineProps<{
  visible: boolean;
  id: string | null;
}>();

const emit = defineEmits(["close"]);

const data = ref<any>(null);

// ======== Список анкет ========
const surveys = ref([]);
const loadingSurveys = ref(false);
const surveyModalVisible = ref(false);

const surveyColumns = [
  { title: $t("l_Fill_date"), dataIndex: "fill_date" },
  { title: $t("l_Risk_identified_date"), dataIndex: "risk_identified_date" },
  { title: $t("l_Nutrition"), dataIndex: "nutrition" },
  { title: $t("l_Depression"), dataIndex: "depression" },
  { title: $t("l_Medical_risks"), dataIndex: "medical_risks" },
  { title: $t("l_Bad_habits"), dataIndex: "bad_habits" },
  { title: $t("l_Social_risks"), dataIndex: "social_risks" },
];

const fetchSurveys = async () => {
  if (!props.id) return;
  loadingSurveys.value = true;
  try {
    const { data } = await PregnantApi(`${props.id}/surveys/`, {}, "GET");
    surveys.value = data;
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
