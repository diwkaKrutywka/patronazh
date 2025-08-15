<template>
  <a-modal
    v-model:open="modalVisible"
    :title="$t('l_Create_survey')"
    @ok="handleSubmit"
    :confirm-loading="loading"
    @cancel="handleCancel"
    destroyOnClose
  >
    <!-- Информационный блок -->
    <div class="mb-4 p-3 border rounded bg-gray-50">
      <p>{{ $t('survey_info_intro') }}</p>
      <p class="font-semibold mt-2">{{ $t('survey_info_risk_system') }}</p>
      <ul class="list-disc ml-5">
        <li>{{ $t('survey_info_score_range') }}</li>
        <li><strong>0</strong> — {{ $t('survey_info_score_0') }}</li>
        <li><strong>1</strong> — {{ $t('survey_info_score_1') }}</li>
        <li><strong>2</strong> — {{ $t('survey_info_score_2') }}</li>
      </ul>
      <p class="font-semibold mt-2">{{ $t('survey_info_overall') }}</p>
      <ul class="list-disc ml-5">
        <li><strong>{{ $t('survey_info_no_risk_label') }}</strong>: {{ $t('survey_info_no_risk') }}</li>
        <li><strong>{{ $t('survey_info_has_risk_label') }}</strong>: {{ $t('survey_info_has_risk') }}</li>
      </ul>
    </div>

    <!-- Форма -->
    <a-form
      :model="form"
      layout="vertical"
    >
      <a-form-item :label="$t('l_Fill_date')">
        <a-date-picker
          v-model:value="form.fill_date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item :label="$t('l_Risk_identified_date')">
        <a-date-picker
          v-model:value="form.risk_identified_date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
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
    </a-form>
  </a-modal>
</template>


<script setup>
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { SurveysApi } from '../../api/survey'

const props = defineProps({
  open: Boolean,
  pregnantWomanId: String,
  surveyId: String // <-- id анкеты для редактирования
})
const emit = defineEmits(['update:open', 'success'])

const modalVisible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const loading = ref(false)

const form = ref({
  pregnant_woman: '',
  fill_date: dayjs().format('YYYY-MM-DD'),
  risk_identified_date: dayjs().format('YYYY-MM-DD'),
  nutrition: 0,
  depression: 0,
  medical_risks: 0,
  bad_habits: 0,
  social_risks: 0
})

watch(
  () => props.open,
  async (val) => {
    if (val) {
      form.value.pregnant_woman = props.pregnantWomanId

      // Если есть surveyId — грузим существующие данные
      if (props.surveyId) {
        loading.value = true
        try {
          const { data } = await SurveysApi(`pregnant-women/${props.surveyId}/`, {}, 'GET')
          form.value = {
            pregnant_woman: data.pregnant_woman,
            fill_date: data.fill_date,
            risk_identified_date: data.risk_identified_date,
            nutrition: data.nutrition,
            depression: data.depression,
            medical_risks: data.medical_risks,
            bad_habits: data.bad_habits,
            social_risks: data.social_risks
          }
        } catch {
          message.error('Failed to load survey details')
        } finally {
          loading.value = false
        }
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

  SurveysApi(url, form.value, method)
    .then(() => {
      message.success(props.surveyId ? 'Survey updated successfully' : 'Survey created successfully')
      emit('success')
      modalVisible.value = false
    })
    .catch(() => {
      message.error(props.surveyId ? 'Error updating survey' : 'Error creating survey')
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCancel = () => {
  modalVisible.value = false
}
</script>
