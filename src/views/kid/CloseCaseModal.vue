<template>
  <a-modal
    v-model:open="visible"
    :title="$t('l_Point_the_reason_for_closing_the_case')"
    :ok-text="$t('l_Close_case')"
    :cancel-text="$t('l_Cancel')"
    @ok="handleClose"
    @cancel="handleCancel"
    :confirm-loading="loading"
  >
    <a-form
      :model="formData"
    >
      <a-form-item
        :rules="[{ required: true, message: $t('l_Required_field') }]"
      >
        <a-textarea
          v-model:value="formData.closure_note"
          :placeholder="$t('l_Enter_closure_note')"
          :rows="4"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
  closure_note: ""
});

watch(
  () => props.open,
  (newValue) => {
    visible.value = newValue;
    if (newValue) {
      // Reset form when modal opens
      formData.value = {
        closure_note: ""
      };
    }
  }
);

watch(visible, (newValue) => {
  emit("update:open", newValue);
});

const handleClose = async () => {
  if (!formData.value.closure_note) {
    // message.error($t("l_Fill_all_required_fields"));
    // return;
  }

  loading.value = true;
  try {
    await ClosedApi("children/close/", {
      patient_id: props.patientId,
      closure_note: formData.value.closure_note
    }, "POST");
    
    emit("success");
    visible.value = false;
  } catch (error) {
    message.error($t("l_Failed_to_close_case"));
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>
