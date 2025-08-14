<template>
    <a-modal
      v-model:open="visible"
      :title="isEdit ? $t('l_Edit_children') : $t('l_Add_children')"
      @ok="handleSubmit"
      :confirm-loading="loading"
      @cancel="handleCancel"
      :okText="$t('l_Add')"
      destroyOnClose
    >
      <a-form
        layout="vertical"
        :model="form"
        :rules="rules"
        ref="formRef"
      >
        <a-form-item :label="$t('l_IIN')" name="iin">
          <a-input v-model:value="form.iin" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Full_name')" name="full_name">
          <a-input v-model:value="form.full_name" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Birth_date')" name="birth_date">
          <a-date-picker style="width: 100%;"
            v-model:value="form.birth_date"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_Gender')" name="gender">
          <a-select v-model:value="form.gender">
            <a-select-option value="MALE">{{ $t('l_Male') }}</a-select-option>
            <a-select-option value="FEMALE">{{ $t('l_Female') }}</a-select-option>
          </a-select>
        </a-form-item>
  
        <a-form-item :label="$t('l_Address')" name="address">
          <a-input v-model:value="form.address" />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { message } from 'ant-design-vue';
  import { KidsApi } from '../../api/kids';
  
  interface KidForm {
    iin: string;
    full_name: string;
    birth_date: string;
    gender: string;
    address: string;
  }
  
  const props = defineProps<{
    open: boolean;
    id?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'submit'): void;
  }>();
  
  const { t: $t } = useI18n();
  
  const visible = ref(false);
  const loading = ref(false);
  const isEdit = ref(false);
  const formRef = ref();
  
  const form = reactive<KidForm>({
    iin: '',
    full_name: '',
    birth_date: '',
    gender: 'MALE',
    address: ''
  });
  
  const rules = {
    iin: [{ required: true, message: $t('l_Required_field') }],
    full_name: [{ required: true, message: $t('l_Required_field') }],
    birth_date: [{ required: true, message: $t('l_Required_field') }],
    gender: [{ required: true, message: $t('l_Required_field') }],
    address: [{ required: true, message: $t('l_Required_field') }]
  };
  
  // Следим за открытием
  watch(() => props.open, async (val) => {
    visible.value = val;
    if (val) {
      isEdit.value = !!props.id;
      if (isEdit.value && props.id) {
        await fetchKid(props.id);
      } else {
        resetForm();
      }
    }
  });
  
  const fetchKid = async (id: string) => {
    try {
      loading.value = true;
      const { data } = await KidsApi<KidForm>(id, {}, 'GET');
      Object.assign(form, data);
    } catch (err) {
      message.error($t('l_Load_error'));
    } finally {
      loading.value = false;
    }
  };
  
  const handleSubmit = () => {
    formRef.value?.validate().then(async () => {
      try {
        loading.value = true;
        if (isEdit.value && props.id) {
          await KidsApi(`${props.id}/`, form, 'PUT');
          message.success($t('l_Updated_successfully'));
        } else {
          await KidsApi('', form, 'POST');
          message.success($t('l_Created_successfully'));
        }
        emit('submit');
        visible.value = false;
        emit('update:open', false);
      } catch (err) {
        message.error($t('l_Save_error'));
      } finally {
        loading.value = false;
      }
    });
  };
  
  const handleCancel = () => {
    visible.value = false;
    emit('update:open', false);
  };
  
  const resetForm = () => {
    form.iin = '';
    form.full_name = '';
    form.birth_date = '';
    form.gender = 'MALE';
    form.address = '';
  };
  </script>
  