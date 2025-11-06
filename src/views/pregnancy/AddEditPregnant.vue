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
          <a-date-picker 
            v-model:value="form.birth_date" 
            format="YYYY-MM-DD" 
            style="width: 100%"
            :disabled-date="disabledBirthDate"
            :default-picker-value="maxBirthDate"
            class="birth-date-picker"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_Pregnancy_weeks_at_registration')" name="pregnancy_weeks_at_registration">
          <a-input-number v-model:value="form.pregnancy_weeks_at_registration" :min="1" :max="42" style="width: 100%" />
        </a-form-item>

        <a-form-item :label="$t('l_Pregnancy_start_date')" name="pregnancy_start_date">
          <a-date-picker 
            v-model:value="form.pregnancy_start_date" 
            format="YYYY-MM-DD" 
            style="width: 100%"
            :disabled-date="disabledPregnancyStartDate"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_Address')" name="address">
          <a-input v-model:value="form.address" />
        </a-form-item>

        <a-form-item :label="$t('l_Phone_number')" name="phone_number">
          <a-input v-model:value="form.phone_number" @input="handlePhoneInput" />
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
  import { ref, watch } from "vue";
  import { message } from "ant-design-vue";
  import { useI18n } from "vue-i18n";
  import { PregnantApi } from "../../api/pregnancy";
  import dayjs from "dayjs";
  import { formatPhoneNumber, validatePhoneNumber, unformatPhoneNumber } from "../../utils/phone";
  
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
  
  const form = ref<{
    full_name: string;
    iin: string;
    birth_date: any;
    pregnancy_weeks_at_registration: number | null;
    pregnancy_start_date: any;
    address: string;
    phone_number: string;
  }>({
    full_name: "",
    iin: "",
    birth_date: null,
    pregnancy_weeks_at_registration: null,
    pregnancy_start_date: null,
    address: "",
    phone_number: formatPhoneNumber("+7"),
  });
  
  const rules = {
    full_name: [{ required: true, message: $t("l_Required_field") }],
    iin: [
      { required: true, message: $t("l_Required_field") },
      { len: 12, message: $t("l_IIN_length_error") },
    ],
    birth_date: [{ required: true, message: $t("l_Required_field") }],
    pregnancy_weeks_at_registration: [{ required: true, message: $t("l_Required_field") }],
    address: [{ required: true, message: $t("l_Required_field") }],
    phone_number: [
      { required: true, message: $t("l_Required_field") },
      {
        validator: (_rule: any, value: string) => {
          if (!value || !validatePhoneNumber(value)) {
            return Promise.reject($t("l_Phone_format_error"));
          }
          return Promise.resolve();
        },
      },
    ],
  };
  
  const closeModal = () => {
    emit("update:open", false);
  };

  const handlePhoneInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const formatted = formatPhoneNumber(target.value);
    form.value.phone_number = formatted;
  };

  // Максимально доступная дата рождения (31 декабря текущий год - 12 лет)
  const maxBirthDate = dayjs().subtract(12, 'year').endOf('year');

  const disabledBirthDate = (current: any) => {
    if (!current) return false;
    
    const today = dayjs();
    
    // Блокируем будущие даты и даты после максимальной допустимой даты рождения
    return current > today.endOf("day") || current > maxBirthDate;
  };

  const disabledPregnancyStartDate = (current: any) => {
    if (!current) return false;
    
    const today = dayjs();
    
    // Максимальная дата - текущий день (нельзя выбрать будущую дату)
    if (current > today.endOf("day")) {
      return true;
    }
    
    // Минимальная дата - дата рождения + 12 лет
    // Если дата рождения не выбрана, разрешаем любую дату (до текущего дня)
    if (!form.value.birth_date) {
      return false;
    }
    
    const birthDate = dayjs(form.value.birth_date);
    const minPregnancyStartDate = birthDate.add(12, 'year').startOf('day');
    
    // Блокируем даты раньше минимальной допустимой даты
    return current < minPregnancyStartDate;
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
        pregnancy_weeks_at_registration: data.pregnancy_weeks_at_registration || null,
        pregnancy_start_date: data.pregnancy_start_date ? dayjs(data.pregnancy_start_date) : null,
        address: data.address,
        phone_number: formatPhoneNumber(data.phone_number || "+7"),
      };
    } finally {
      loading.value = false;
    }
  };
  
  const handleSubmit = () => {
    formRef.value.validate().then(async () => {
      loading.value = true;
      try {
        const payload: any = {
          ...form.value,
          birth_date: form.value.birth_date ? dayjs(form.value.birth_date).format("YYYY-MM-DD") : null,
          phone_number: unformatPhoneNumber(form.value.phone_number),
        };
        
        // Only include pregnancy_start_date if it has a value
        if (form.value.pregnancy_start_date) {
          payload.pregnancy_start_date = dayjs(form.value.pregnancy_start_date).format("YYYY-MM-DD");
        }
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
            pregnancy_weeks_at_registration: null,
            pregnancy_start_date: null,
            address: "",
            phone_number: formatPhoneNumber("+7"),
          };
        }
      }
    }
  );
  </script>
  
  <style scoped>
  /* Скрываем кнопки навигации по годам/десятилетиям */
  :deep(.birth-date-picker .ant-picker-header-super-prev-btn),
  :deep(.birth-date-picker .ant-picker-header-super-next-btn) {
    display: none !important;
  }
  
  /* Блокируем клик на заголовок (год/месяц) чтобы нельзя было перейти на уровень выбора года */
  :deep(.birth-date-picker .ant-picker-header-view) {
    pointer-events: none;
    cursor: default;
    user-select: none;
  }
  
  :deep(.birth-date-picker .ant-picker-header-view:hover) {
    color: inherit;
  }
  </style>
  