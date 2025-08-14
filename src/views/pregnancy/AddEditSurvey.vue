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
  PregnantApi(`${props.pregnantWomanId}/create-survey`, form.value, 'POST')
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

<template>
  <a-modal
    v-model:open="modalVisible"
    :title="$t('l_Create_survey')"
    @ok="handleSubmit"
    :confirm-loading="loading"
    @cancel="handleCancel"
  >
    <!-- форма тут -->
  </a-modal>
</template>
