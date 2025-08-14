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
import { PregnantApi } from '../../api/pregnancy'
const props = defineProps({
  open: Boolean,
  pregnantWomanId: String
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
  (val) => {
    if (val) {
      form.value.pregnant_woman = props.pregnantWomanId
    }
  }
)

const handleSubmit = () => {
  loading.value = true
  PregnantApi(`${props.pregnantWomanId}/create-survey/`, form.value, 'POST')
    .then(() => {
      message.success('Survey created successfully')
      emit('success')
      modalVisible.value = false
    })
    .catch(() => {
      message.error('Error creating survey')
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCancel = () => {
  modalVisible.value = false
}
</script>

