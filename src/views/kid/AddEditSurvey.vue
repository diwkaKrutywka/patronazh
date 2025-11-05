<template>
  <a-modal
    v-model:open="modalVisible"
    :title="$t('l_Create_child_survey')"
    :confirm-loading="loading"
    :footer="null"
    @cancel="handleCancel"
    :okText="$t('l_Create')"
    destroyOnClose
    width="700px"
    :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto' }"
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

    <!-- Ключевые даты -->
    <div v-if="keyDates.length > 0" class="mt-4">
      <h4 class="text-sm font-semibold mb-2">{{ $t("l_Key_dates") }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="(keyDate, index) in keyDates"
          :key="index"
          class="bg-red-100 border border-red-300 rounded p-3 text-sm"
        >
          <div class="font-medium text-red-800">{{ keyDate.period_name }}</div>
            <div class="text-red-700">
              <div>{{ $t("l_Date") }}:<br>{{ keyDate.date_str }}</div>
              <div> {{ keyDate.date }}</div>
            <div v-if="keyDate.range_start && keyDate.range_end">
              {{ $t("l_Period") }}: {{ keyDate.range_start }} -
              {{ keyDate.range_end }}
            </div>
            <div v-if="keyDate.days_overdue !== undefined">
              {{ $t("l_Days_overdue") }}: {{ keyDate.days_overdue }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Форма -->

    <a-form :model="form" layout="vertical" class="survey-form mt-4">
      <div class="grid grid-cols-2 gap-4">
        <a-form-item :label="$t('l_Fill_date')">
          <a-date-picker
            v-model:value="form.fill_date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </a-form-item>
      
         <a-form-item :label="$t('l_Planned_visit_date')">
           <a-date-picker
             v-model:value="form.planned_visit_date"
             value-format="YYYY-MM-DD"
             :disabled-date="disabledDate"
             style="width: 100%"
           />
         </a-form-item>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <a-form-item :label="$t('l_Survey_reason')">
          <a-select v-model:value="form.survey_period" style="width: 100%">
            <a-select-option value="first_3_days">{{
              $t("l_First_3_days")
            }}</a-select-option>
            <a-select-option value="14_days">{{
              $t("l_14_days")
            }}</a-select-option>
            <a-select-option value="1_5_months">{{
              $t("l_1_5_months")
            }}</a-select-option>
            <a-select-option value="5_months">{{
              $t("l_5_months")
            }}</a-select-option>
            <a-select-option value="9_months">{{
              $t("l_9_months")
            }}</a-select-option>
            <a-select-option value="15_months">{{
              $t("l_15_months")
            }}</a-select-option>
            <a-select-option value="21_months">{{
              $t("l_21_months")
            }}</a-select-option>
            <a-select-option value="33_months">{{
              $t("l_33_months")
            }}</a-select-option>
            <a-select-option value="unscheduled">{{
              $t("l_Unscheduled")
            }}</a-select-option>
            <a-select-option value="">{{
              $t("l_Not_specified")
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </div>

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

      <div class="flex justify-end gap-2">
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
import { KeyApi } from "../../api/key";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const props = defineProps({
  open: { type: Boolean },
  childId: { type: String, required: false },
  surveyId: { type: String, required: false },
});
const emit = defineEmits(["update:open", "success"]);

const modalVisible = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const loading = ref(false);
const keyDates = ref([]);
const keyDatesLoading = ref(false);

const form = ref({
  child: "",
  fill_date: dayjs().format("YYYY-MM-DD"),
  planned_visit_date: "",
  survey_period: "",
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

// Функция для загрузки ключевых дат
const fetchKeyDates = async () => {
  if (!props.childId) return;

  keyDatesLoading.value = true;
  try {
    const { data } = await KeyApi(props.childId, {}, "GET");
    keyDates.value = data.key_dates || [];
  } catch (error) {
    console.error("Failed to load key dates:", error);
    keyDates.value = [];
  } finally {
    keyDatesLoading.value = false;
  }
};

watch(
  () => props.open,
  async (val) => {
    if (val) {
      // Всегда сбрасываем форму при открытии
      resetForm();

      // Загружаем ключевые даты
      await fetchKeyDates();

      if (props.surveyId) {
        // Если есть surveyId — загружаем данные для редактирования
        loading.value = true;
        try {
          const { data } = await SurveysApi(
            `children/${props.surveyId}/`,
            {},
            "GET"
          );
          form.value = { ...data };
        } catch {
          message.error($t("l_Failed_to_load_survey_details"));
        } finally {
          loading.value = false;
        }
      }
    } else {
      // Сбрасываем форму при закрытии модалки
      resetForm();
      keyDates.value = [];
    }
  }
);

// Дополнительно отслеживаем изменения surveyId
watch(
  () => props.surveyId,
  (newSurveyId) => {
    if (props.open) {
      if (newSurveyId) {
        // Если surveyId изменился на существующий - загружаем данные
        loading.value = true;
        SurveysApi(`children/${newSurveyId}/`, {}, "GET")
          .then(({ data }) => {
            form.value = { ...data };
          })
          .catch(() => {
            message.error($t("l_Failed_to_load_survey_details"));
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        // Если surveyId стал undefined - сбрасываем форму
        resetForm();
      }
    }
  }
);

// Авторасчёты
const totalScore = computed(() => {
  return Object.entries(form.value)
    .filter(
      ([k]) =>
        !["child", "fill_date", "planned_visit_date", "survey_period"].includes(
          k
        )
    )
    .reduce((sum, [_, v]) => sum + (Number(v) || 0), 0);
});

const maxScore = computed(() => {
  const values = Object.entries(form.value)
    .filter(
      ([k]) =>
        !["child", "fill_date", "planned_visit_date", "survey_period"].includes(
          k
        )
    )
    .map(([_, v]) => Number(v) || 0);

  return Math.max(...values);
});

const riskLevel = computed(() => {
  // Если в любом поле есть значение 2, то уровень риска HIGH
  if (maxScore.value === 2) return "HIGH";
  // Если в любом поле есть значение 1, то уровень риска MODERATE
  if (maxScore.value === 1) return "MODERATE";
  // Если все поля 0, то уровень риска LOW
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

  // Filter out empty survey_period and planned_visit_date
  const submitData = { ...form.value };
  if (!submitData.survey_period || submitData.survey_period === "") {
    delete submitData.survey_period;
  }
  if (!submitData.planned_visit_date || submitData.planned_visit_date === "") {
    delete submitData.planned_visit_date;
  }

  SurveysApi(url, submitData, method)
    .then(() => {
      message.success(
        props.surveyId
          ? $t("l_Survey_updated_successfully")
          : $t("l_Survey_created_successfully")
      );
      emit("success");
      modalVisible.value = false;
      // Сбрасываем форму после успешного сохранения
      resetForm();
    })
    .catch(() => {
      message.error(
        props.surveyId
          ? $t("l_Error_updating_survey")
          : $t("l_Error_creating_survey")
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

const resetForm = () => {
  form.value = {
    child: props.childId,
    fill_date: dayjs().format("YYYY-MM-DD"),
    planned_visit_date: "",
    survey_period: "",
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
  };
};

const handleCancel = () => {
  modalVisible.value = false;
  // Сбрасываем форму при закрытии
  resetForm();
};

// Функция для отключения прошедших дат
const disabledDate = (current) => {
  // Отключаем все даты до сегодняшнего дня (не включая сегодня)
  return current && current < dayjs().startOf('day');
};
</script>

<style scoped>
.survey-form .ant-form-item {
  margin-bottom: 8px;
}
</style>
