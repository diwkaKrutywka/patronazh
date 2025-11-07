<template>
  <a-modal
    v-model:open="visible"
    :title="$t('l_Return_patient_to_active_monitoring')"
    :ok-text="$t('l_Return')"
    :cancel-text="$t('l_Cancel')"
    @ok="handleReopen"
    @cancel="handleCancel"
    :confirm-loading="loading"
    width="600px"
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
        <a-col :span="12">
          <a-form-item :label="$t('l_Nutrition')">
            <a-input-number
              v-model:value="formData.nutrition"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('l_Depression')">
            <a-input-number
              v-model:value="formData.depression"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('l_Medical_risks')">
            <a-input-number
              v-model:value="formData.medical_risks"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('l_Bad_habits')">
            <a-input-number
              v-model:value="formData.bad_habits"
              :min="0"
              :max="1"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('l_Social_risks')">
            <a-input-number
              v-model:value="formData.social_risks"
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
  nutrition: 0,
  depression: 0,
  medical_risks: 0,
  bad_habits: 0,
  social_risks: 0
});

const maxScore = computed(() => {
  return Math.max(
    formData.value.nutrition,
    formData.value.depression,
    formData.value.medical_risks,
    formData.value.bad_habits,
    formData.value.social_risks
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
        nutrition: 0,
        depression: 0,
        medical_risks: 0,
        bad_habits: 0,
        social_risks: 0
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
    await ClosedApi("pregnant-women/create-survey-from-closed", {
      closed_case: props.patientId,
      reopen_note: formData.value.reopen_note,
      nutrition: formData.value.nutrition,
      depression: formData.value.depression,
      medical_risks: formData.value.medical_risks,
      bad_habits: formData.value.bad_habits,
      social_risks: formData.value.social_risks
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
