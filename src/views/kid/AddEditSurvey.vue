<template>
  <a-modal
    v-model:open="modalVisible"
    :title="$t('l_Create_child_survey')"
    :confirm-loading="loading"
    :footer="null"
      @cancel="closeModal"
    :okText="$t('l_Create')"
    destroyOnClose
    width="900px"
  >
    <!-- Инфо блок -->
    <div class="mb-4 p-3 border rounded bg-gray-50">
      <p>{{ $t("child_survey_info_intro") }}</p>
      <p class="font-semibold mt-2">
        {{ $t("child_survey_info_risk_system") }}
      </p>
      <ul class="list-disc ml-5">
        <li>0 — {{ $t("survey_info_score_0") }} 🟢</li>
        <li>1 — {{ $t("survey_info_score_1") }} 🟡</li>
        <li>2 — {{ $t("survey_info_score_2") }} 🔴</li>
      </ul>
      <p class="font-semibold mt-2">{{ $t("survey_info_overall") }}</p>
      <p>
        {{ $t("survey_info_explanation") }}
      </p>
    </div>

    <!-- Форма -->
    <a-form :model="form" layout="vertical">
      <a-form-item :label="$t('l_Fill_date')">
        <a-date-picker
          v-model:value="form.fill_date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 16 критериев -->
      <div class="grid grid-cols-2 gap-4">
        <a-form-item :label="$t('l_Breastfeeding')">
          <a-input-number
            v-model:value="form.breastfeeding"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Complementary_feeding')">
          <a-input-number
            v-model:value="form.complementary_feeding"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Attachment')">
          <a-input-number
            v-model:value="form.attachment"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Father_involvement')">
          <a-input-number
            v-model:value="form.father_involvement"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Stimulating_environment')">
          <a-input-number
            v-model:value="form.stimulating_environment"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Parental_depression')">
          <a-input-number
            v-model:value="form.parental_depression"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Safe_environment')">
          <a-input-number
            v-model:value="form.safe_environment"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Neglect_abuse')">
          <a-input-number
            v-model:value="form.neglect_abuse"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Medical_risks')">
          <a-input-number
            v-model:value="form.medical_risks"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Speech_development')">
          <a-input-number
            v-model:value="form.speech_development"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Motor_development')">
          <a-input-number
            v-model:value="form.motor_development"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Socio_emotional_development')">
          <a-input-number
            v-model:value="form.socio_emotional_development"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Low_weight')">
          <a-input-number
            v-model:value="form.low_weight"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Low_height')">
          <a-input-number
            v-model:value="form.low_height"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Overweight')">
          <a-input-number
            v-model:value="form.overweight"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item :label="$t('l_Social_risks')">
          <a-input-number
            v-model:value="form.social_risks"
            :min="0"
            :max="2"
            style="width: 100%"
          />
        </a-form-item>
      </div>

      <!-- Автовычисления -->
      <a-divider />
      <a-descriptions bordered column="3" size="small">
        <a-descriptions-item :label="$t('l_Total_score')">
          {{ totalScore }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Max_score')">
          {{ maxScore }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Risk_level')">
          <span :class="riskLevelClass">{{ riskLevel }}</span>
        </a-descriptions-item>
      </a-descriptions>

      <div class="flex justify-end gap-2 mt-4">
        <a-button type="primary" @click="handleSubmit">{{
          $t("l_Create")
        }}</a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { SurveysApi } from "../../api/survey";

const props = defineProps({
  open: Boolean,
  childId: String,
  surveyId: String,
});
const emit = defineEmits(["update:open", "success"]);

const modalVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const loading = ref(false);

const form = ref({
  child: "",
  fill_date: dayjs().format('YYYY-MM-DD'),
  breastfeeding: 0,
  complementary_feeding: 0,
  attachment: 0,
  father_involvement: 0,
  stimulating_environment: 0,
  parental_depression: 0,
  safe_environment: 0,
  neglect_abuse: 0,
  medical_risks: 0,
  speech_development: 0,
  motor_development: 0,
  socio_emotional_development: 0,
  low_weight: 0,
  low_height: 0,
  overweight: 0,
  social_risks: 0,
});

watch(
  () => props.open,
  async (val) => {
    if (val) {
      form.value.child = props.childId;

      if (props.surveyId) {
        loading.value = true;
        try {
          const { data } = await SurveysApi(
            `children/${props.surveyId}/`,
            {},
            "GET"
          );
          form.value = { ...data };
        } catch {
          message.error("Failed to load survey details");
        } finally {
          loading.value = false;
        }
      }
    }
  }
);

// Авторасчёты
const totalScore = computed(() => {
  return Object.entries(form.value)
    .filter(([k]) => !["child", "fill_date"].includes(k))
    .reduce((sum, [_, v]) => sum + (Number(v) || 0), 0);
});

const maxScore = computed(() => {
  return Math.max(
    ...Object.entries(form.value)
      .filter(([k]) => !["child", "fill_date"].includes(k))
      .map(([_, v]) => Number(v) || 0)
  );
});

const riskLevel = computed(() => {
  if (maxScore.value === 2) return "HIGH";
  if (maxScore.value === 1) return "MODERATE";
  return "LOW";
});

const riskLevelClass = computed(() => {
  return {
    "text-red-500 font-bold": riskLevel.value === "HIGH",
    "text-yellow-500 font-bold": riskLevel.value === "MODERATE",
    "text-green-500 font-bold": riskLevel.value === "LOW",
  };
});

const handleSubmit = () => {
  loading.value = true;
  const method = props.surveyId ? "PUT" : "POST";
  const url = props.surveyId ? `children/${props.surveyId}/` : "children/";
  // Ensure child ID is set for new surveys
  if (!props.surveyId) {
    form.value.child = props.childId;
  }

  SurveysApi(url, form.value, method)
    .then(() => {
      message.success(
        props.surveyId
          ? "Survey updated successfully"
          : "Survey created successfully"
      );
      emit("success");
      modalVisible.value = false;
    })
    .catch(() => {
      message.error(
        props.surveyId ? "Error updating survey" : "Error creating survey"
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleCancel = () => {
  modalVisible.value = false;
};
</script>
