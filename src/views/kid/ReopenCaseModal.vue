<template>
  <a-modal
    v-model:open="visible"
    :title="$t('l_Return_patient_to_active_monitoring')"
    :ok-text="$t('l_Return')"
    :cancel-text="$t('l_Cancel')"
    @ok="handleReopen"
    @cancel="handleCancel"
    :confirm-loading="loading"
    width="800px"
  >
    <a-form
      :model="formData"
      layout="vertical"
    >
      <a-form-item
        :label="$t('l_Reopen_note')"
        :rules="[{ required: true, message: $t('l_Required_field') }]"
      >
        <a-textarea
          v-model:value="formData.reopen_note"
          :placeholder="$t('l_Enter_reopen_note')"
          :rows="3"
          style="width: 100%"
        />
      </a-form-item>

      <a-divider>{{ $t('l_Risk_assessment') }}</a-divider>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Breastfeeding')">
            <a-input-number
              v-model:value="formData.breastfeeding"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Complementary_feeding')">
            <a-input-number
              v-model:value="formData.complementary_feeding"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Attachment')">
            <a-input-number
              v-model:value="formData.attachment"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Father_involvement')">
            <a-input-number
              v-model:value="formData.father_involvement"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Stimulating_environment')">
            <a-input-number
              v-model:value="formData.stimulating_environment"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Parental_depression')">
            <a-input-number
              v-model:value="formData.parental_depression"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Safe_environment')">
            <a-input-number
              v-model:value="formData.safe_environment"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Neglect_abuse')">
            <a-input-number
              v-model:value="formData.neglect_abuse"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Medical_risks')">
            <a-input-number
              v-model:value="formData.medical_risks"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Speech_development')">
            <a-input-number
              v-model:value="formData.speech_development"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Motor_development')">
            <a-input-number
              v-model:value="formData.motor_development"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Socio_emotional_development')">
            <a-input-number
              v-model:value="formData.socio_emotional_development"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Low_weight')">
            <a-input-number
              v-model:value="formData.low_weight"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Low_height')">
            <a-input-number
              v-model:value="formData.low_height"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Premature_birth')">
            <a-input-number
              v-model:value="formData.premature_birth"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Developmental_delays')">
            <a-input-number
              v-model:value="formData.developmental_delays"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Vaccination_status')">
            <a-input-number
              v-model:value="formData.vaccination_status"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Overweight')">
            <a-input-number
              v-model:value="formData.overweight"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="$t('l_Social_risks')">
            <a-input-number
              v-model:value="formData.social_risks"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Vision_hearing')">
            <a-input-number
              v-model:value="formData.vision_hearing"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="$t('l_Chronic_diseases')">
            <a-input-number
              v-model:value="formData.chronic_diseases"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-alert
        v-if="maxScore > 0"
        :message="$t('l_Risk_package_will_be_assigned')"
        type="info"
        show-icon
        style="margin-top: 16px"
      />
      <a-alert
        v-else
        :message="$t('l_Universal_package_will_be_assigned')"
        type="success"
        show-icon
        style="margin-top: 16px"
      />
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { ClosedApi } from "../../api/closed";

const { t: $t } = useI18n();

const props = defineProps({
  open: { type: Boolean, default: false },
  patientId: { type: String, required: true }
});

const emit = defineEmits(["update:open", "success"]);

const visible = ref(false);
const loading = ref(false);

const formData = ref({
  reopen_note: "",
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
  premature_birth: 0,
  developmental_delays: 0,
  vaccination_status: 0,
  overweight: 0,
  social_risks: 0,
  vision_hearing: 0,
  chronic_diseases: 0
});

const maxScore = computed(() => {
  return Math.max(
    formData.value.breastfeeding,
    formData.value.complementary_feeding,
    formData.value.attachment,
    formData.value.father_involvement,
    formData.value.stimulating_environment,
    formData.value.parental_depression,
    formData.value.safe_environment,
    formData.value.neglect_abuse,
    formData.value.medical_risks,
    formData.value.speech_development,
    formData.value.motor_development,
    formData.value.socio_emotional_development,
    formData.value.low_weight,
    formData.value.low_height,
    formData.value.premature_birth,
    formData.value.developmental_delays,
    formData.value.vaccination_status,
    formData.value.overweight,
    formData.value.social_risks,
    formData.value.vision_hearing,
    formData.value.chronic_diseases
  );
});

watch(
  () => props.open,
  (newValue) => {
    visible.value = newValue;
    if (newValue) {
      // Reset form when modal opens
      formData.value = {
        reopen_note: "",
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
        premature_birth: 0,
        developmental_delays: 0,
        vaccination_status: 0,
        overweight: 0,
        social_risks: 0,
        vision_hearing: 0,
        chronic_diseases: 0
      };
    }
  }
);

watch(visible, (newValue) => {
  emit("update:open", newValue);
});

const handleReopen = async () => {
  if (!formData.value.reopen_note) {
    message.error($t("l_Fill_all_required_fields"));
    return;
  }

  loading.value = true;
  try {
    await ClosedApi("children/create-survey-from-closed", {
      closed_case: props.patientId,
      reopen_note: formData.value.reopen_note,
      breastfeeding: formData.value.breastfeeding,
      complementary_feeding: formData.value.complementary_feeding,
      attachment: formData.value.attachment,
      father_involvement: formData.value.father_involvement,
      stimulating_environment: formData.value.stimulating_environment,
      parental_depression: formData.value.parental_depression,
      safe_environment: formData.value.safe_environment,
      neglect_abuse: formData.value.neglect_abuse,
      medical_risks: formData.value.medical_risks,
      speech_development: formData.value.speech_development,
      motor_development: formData.value.motor_development,
      socio_emotional_development: formData.value.socio_emotional_development,
      low_weight: formData.value.low_weight,
      low_height: formData.value.low_height,
      premature_birth: formData.value.premature_birth,
      developmental_delays: formData.value.developmental_delays,
      vaccination_status: formData.value.vaccination_status,
      overweight: formData.value.overweight,
      social_risks: formData.value.social_risks,
      vision_hearing: formData.value.vision_hearing,
      chronic_diseases: formData.value.chronic_diseases
    }, "POST");
    
    message.success($t("l_Patient_returned_successfully"));
    emit("success");
    visible.value = false;
  } catch (error) {
    // console.error('Error reopening case:', error);
    // message.error($t("l_Failed_to_return_patient"));
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>
