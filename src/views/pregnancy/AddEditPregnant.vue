<template>
    <a-modal
      :title="id ? $t('l_Edit_pregnant') : $t('l_Add_pregnant')"
      :visible="open"
    footer
      @cancel="closeModal"
      :confirmLoading="loading"
      destroyOnClose
    >
      <a-form
        :model="form"
        :rules="rules"
        layout="vertical"
        ref="formRef"
      >
        <a-form-item :label="$t('l_Full_name')" name="full_name">
          <a-input v-model:value="form.full_name" />
        </a-form-item>
  
        <a-form-item :label="$t('l_IIN')" name="iin">
          <a-input v-model:value="form.iin" maxlength="12" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Birth_date')" name="birth_date">
          <a-date-picker v-model:value="form.birth_date" format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Visit_date')" name="visit_date">
          <a-date-picker v-model:value="form.visit_date" format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Due_date_12_weeks')" name="due_date_12_weeks">
          <a-date-picker v-model:value="form.due_date_12_weeks" format="YYYY-MM-DD" style="width: 100%" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Address')" name="address">
          <a-input v-model:value="form.address" />
        </a-form-item>
        <div class="flex justify-end gap-2 mt-4">
        <a-button type="primary" @click="handleSubmit">{{
          $t("l_Create")
        }}</a-button>
      </div>
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import { message } from "ant-design-vue";
  import { useI18n } from "vue-i18n";
  import { PregnantApi } from "../../api/pregnancy";
  import dayjs from "dayjs";
  
  const props = defineProps<{
    id?: string | null;
    open: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "submit"): void;
  }>();
  
  const { t: $t } = useI18n();
  
  const loading = ref(false);
  const formRef = ref();
  
  const form = ref({
    full_name: "",
    iin: "",
    birth_date: null,
    visit_date: null,
    due_date_12_weeks: null,
    address: "",
  });
  
  const rules = {
    full_name: [{ required: true, message: $t("l_Required_field") }],
    iin: [
      { required: true, message: $t("l_Required_field") },
      { len: 12, message: $t("l_IIN_length_error") },
    ],
    birth_date: [{ required: true, message: $t("l_Required_field") }],
    visit_date: [{ required: true, message: $t("l_Required_field") }],
    due_date_12_weeks: [{ required: true, message: $t("l_Required_field") }],
    address: [{ required: true, message: $t("l_Required_field") }],
  };
  
  const closeModal = () => {
    emit("update:open", false);
  };
  
  const loadData = async () => {
    if (!props.id) return;
    loading.value = true;
    try {
      const { data } = await PregnantApi(`${props.id}/`, {}, "GET");
      form.value = {
        full_name: data.full_name,
        iin: data.iin,
        birth_date: data.birth_date ? dayjs(data.birth_date) : null,
        visit_date: data.visit_date ? dayjs(data.visit_date) : null,
        due_date_12_weeks: data.due_date_12_weeks ? dayjs(data.due_date_12_weeks) : null,
        address: data.address,
      };
    } finally {
      loading.value = false;
    }
  };
  
  const handleSubmit = () => {
    formRef.value.validate().then(async () => {
      loading.value = true;
      try {
        const payload = {
          ...form.value,
          birth_date: form.value.birth_date ? dayjs(form.value.birth_date).format("YYYY-MM-DD") : null,
          visit_date: form.value.visit_date ? dayjs(form.value.visit_date).format("YYYY-MM-DD") : null,
          due_date_12_weeks: form.value.due_date_12_weeks ? dayjs(form.value.due_date_12_weeks).format("YYYY-MM-DD") : null,
        };
        if (props.id) {
          await PregnantApi(`${props.id}/`, payload, "PUT");
          message.success($t("l_Update_success"));
        } else {
          await PregnantApi("", payload, "POST");
          message.success($t("l_Add_success"));
        }
        emit("submit");
        closeModal();
      } catch {
        message.error($t("l_Save_failed"));
      } finally {
        loading.value = false;
      }
    });
  };
  
  watch(
    () => props.open,
    (val) => {
      if (val) {
        if (props.id) loadData();
        else {
          form.value = {
            full_name: "",
            iin: "",
            birth_date: null,
            visit_date: null,
            due_date_12_weeks: null,
            address: "",
          };
        }
      }
    }
  );
  </script>
  