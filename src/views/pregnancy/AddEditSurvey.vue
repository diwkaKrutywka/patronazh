<template>
  <a-modal
    v-model:open="modalVisible"
    :title="$t('l_Create_survey')"
      @cancel="handleCancel"
    :confirm-loading="loading"
    :footer="null"
    destroyOnClose
    :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto' }"
  >
    <!-- Информационный блок -->
    <div class="mb-4 p-3 border rounded bg-gray-50 text-sm">
      <p class="text-xs">{{ $t('survey_info_intro') }}</p>
      <p class="font-semibold mt-2 text-xs">{{ $t('survey_info_risk_system') }}</p>
      <ul class="list-disc ml-5 text-xs">
        <li>{{ $t('survey_info_score_range') }}</li>
        <li><strong>0</strong> — {{ $t('survey_info_score_0') }}</li>
        <li><strong>1</strong> — {{ $t('survey_info_score_1') }}</li>
        <li><strong>2</strong> — {{ $t('survey_info_score_2') }}</li>
      </ul>
      <p class="font-semibold mt-2 text-xs">{{ $t('survey_info_overall') }}</p>
      <ul class="list-disc ml-5 text-xs">
        <li><strong>{{ $t('survey_info_no_risk_label') }}</strong>: {{ $t('survey_info_no_risk') }}</li>
        <li><strong>{{ $t('survey_info_has_risk_label') }}</strong>: {{ $t('survey_info_has_risk') }}</li>
      </ul>
    </div>
    <!-- Ключевые даты -->
    <div v-if="keyDates.length > 0" class="mt-4">
      <h4 class="text-sm font-semibold mb-2">{{ $t('l_Key_dates') }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="(keyDate, index) in keyDates" 
          :key="index"
          class="bg-red-100 border border-red-300 rounded p-3 text-sm"
        >
          <div class="font-medium text-red-800">{{ keyDate.period_name }}</div>
          <div class="text-red-700">
            <div>{{ $t('l_Date') }}:<br>{{ keyDate.date_str }}</div>
            <div>{{ keyDate.date }}</div>
            <div v-if="keyDate.range_start && keyDate.range_end">
              {{ $t('l_Period') }}: {{ keyDate.range_start }} - {{ keyDate.range_end }}
            </div>
            <div v-if="keyDate.days_overdue !== undefined">
              {{ $t('l_Days_overdue') }}: {{ keyDate.days_overdue }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Форма -->
    <a-form
      :model="form"
      layout="vertical"
      class="survey-form mt-4"
    >
      <a-form-item :label="$t('l_Fill_date')">
        <a-date-picker
          v-model:value="form.fill_date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </a-form-item>

      <!-- <a-form-item :label="$t('l_Risk_identified_date')">
        <a-date-picker
          v-model:value="form.risk_identified_date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </a-form-item> -->
      <a-form-item :label="$t('l_Planned_visit_date')">
        <a-date-picker
          v-model:value="form.planned_visit_date"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item :label="$t('l_Survey_reason')">
        <a-select v-model:value="form.survey_period" style="width: 100%">
          <a-select-option value="12_weeks">{{ $t('l_12_weeks') }}</a-select-option>
          <a-select-option value="32_weeks">{{ $t('l_32_weeks') }}</a-select-option>
          <a-select-option value="unschedule">{{ $t('l_Unschedule') }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('l_Nutrition')">
        <a-input-number v-model:value="form.nutrition" :min="0" :max="2" style="width: 100%" />
      </a-form-item>

      <a-form-item :label="$t('l_Depression')">
        <a-input-number v-model:value="form.depression" :min="0" :max="2" style="width: 100%" />
      </a-form-item>

      <a-form-item :label="$t('l_Medical_risks')">
        <a-input-number v-model:value="form.medical_risks" :min="0" :max="2" style="width: 100%" />
      </a-form-item>

      <a-form-item :label="$t('l_Bad_habits')">
        <a-input-number v-model:value="form.bad_habits" :min="0" :max="2" style="width: 100%" />
      </a-form-item>

      <a-form-item :label="$t('l_Social_risks')">
        <a-input-number v-model:value="form.social_risks" :min="0" :max="2" style="width: 100%" />
      </a-form-item>

      <div class="flex justify-end gap-2">
        <a-button type="primary" @click="handleSubmit">{{
          $t("l_Create")
        }}</a-button>
      </div>
    </a-form>


  </a-modal>
</template>


<script setup>
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { SurveysApi } from '../../api/survey'
import { KeyApi } from '../../api/key'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  open: { type: Boolean },
  pregnantWomanId: { type: String, required: false },
  surveyId: { type: String, required: false }
});;
const emit = defineEmits(['update:open', 'success'])

const modalVisible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const loading = ref(false)
const keyDates = ref([])
const keyDatesLoading = ref(false)

const form = ref({
  pregnant_woman: '',
  fill_date: dayjs().format('YYYY-MM-DD'),
  risk_identified_date: dayjs().format('YYYY-MM-DD'),
  // planned_visit_date: dayjs().format('YYYY-MM-DD'),
  survey_period: '',
  nutrition: 0,
  depression: 0,
  medical_risks: 0,
  bad_habits: 0,
  social_risks: 0
})

// Функция для загрузки ключевых дат
const fetchKeyDates = async () => {
  if (!props.pregnantWomanId) return
  
  keyDatesLoading.value = true
  try {
    const { data } = await KeyApi(props.pregnantWomanId, {}, 'GET')
    keyDates.value = data.key_dates || []
  } catch (error) {
    console.error('Failed to load key dates:', error)
    keyDates.value = []
  } finally {
    keyDatesLoading.value = false
  }
}

watch(
  () => props.open,
  async (val) => {
    if (val) {
      // Всегда сбрасываем форму при открытии
      resetForm()
      
      // Загружаем ключевые даты
      await fetchKeyDates()
      
      if (props.surveyId) {
        // Если есть surveyId — загружаем данные для редактирования
        loading.value = true
        try {
          const { data } = await SurveysApi(`pregnant-women/${props.surveyId}/`, {}, 'GET')
          form.value = {
            pregnant_woman: data.pregnant_woman,
            fill_date: data.fill_date || dayjs().format('YYYY-MM-DD'),
        //    risk_identified_date: data.risk_identified_date,
            nutrition: data.nutrition,
            depression: data.depression,
            medical_risks: data.medical_risks,
            bad_habits: data.bad_habits,
            social_risks: data.social_risks,
            survey_period: data.survey_period,
            planned_visit_date: data.planned_visit_date
          }
        } catch {
          message.error($t('l_Failed_to_load_survey_details'))
        } finally {
          loading.value = false
        }
      }
    } else {
      // Сбрасываем форму при закрытии модалки
      resetForm()
      keyDates.value = []
    }
  }
)

// Дополнительно отслеживаем изменения surveyId
watch(
  () => props.surveyId,
  (newSurveyId) => {
    if (props.open) {
      if (newSurveyId) {
        // Если surveyId изменился на существующий - загружаем данные
        loading.value = true
        SurveysApi(`pregnant-women/${newSurveyId}/`, {}, 'GET')
          .then(({ data }) => {
            form.value = {
              pregnant_woman: data.pregnant_woman,
              fill_date: data.fill_date || dayjs().format('YYYY-MM-DD'),
       //       risk_identified_date: data.risk_identified_date,
              nutrition: data.nutrition,
              depression: data.depression,
              medical_risks: data.medical_risks,
              bad_habits: data.bad_habits,
              social_risks: data.social_risks,
              survey_period: data.survey_period,
              planned_visit_date: data.planned_visit_date
            }
          })
          .catch(() => {
            message.error($t('l_Failed_to_load_survey_details'))
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        // Если surveyId стал undefined - сбрасываем форму
        resetForm()
      }
    }
  }
)

const handleSubmit = () => {
  loading.value = true

  const method = props.surveyId ? 'PUT' : 'POST'
  const url = props.surveyId
    ? `pregnant-women/${props.surveyId}/`
    : 'pregnant-women/'

  // Filter out empty survey_period and planned_visit_date
  const submitData = { ...form.value }
  if (!submitData.survey_period || submitData.survey_period === '') {
    delete submitData.survey_period
  }
  if (!submitData.planned_visit_date || submitData.planned_visit_date === '') {
    delete submitData.planned_visit_date
  }

  SurveysApi(url, submitData, method)
    .then(() => {
      message.success(props.surveyId ? $t('l_Survey_updated_successfully') : $t('l_Survey_created_successfully'))
      emit('success')
      modalVisible.value = false
      // Сбрасываем форму после успешного сохранения
      resetForm()
    })
    .catch(() => {
      message.error(props.surveyId ? $t('l_Error_updating_survey') : $t('l_Error_creating_survey'))
    })
    .finally(() => {
      loading.value = false
    })
}

const resetForm = () => {
  form.value = {
    pregnant_woman: props.pregnantWomanId,
    fill_date: dayjs().format('YYYY-MM-DD'),
    risk_identified_date: dayjs().format('YYYY-MM-DD'),
    nutrition: 0,
    depression: 0,
    medical_risks: 0,
    bad_habits: 0,
    social_risks: 0
  }
}

const handleCancel = () => {
  // Сбрасываем форму при закрытии
  resetForm()
  modalVisible.value = false
}

// Функция для отключения прошедших дат
const disabledDate = (current) => {
  // Отключаем все даты до сегодняшнего дня (не включая сегодня)
  return current && current < dayjs().startOf('day')
}
</script>

<style scoped>
.survey-form .ant-form-item {
  margin-bottom: 8px;
}

.survey-form .ant-form-item-label > label {
  font-size: 12px !important;
}
</style>
