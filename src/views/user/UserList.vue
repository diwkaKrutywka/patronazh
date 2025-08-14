<template>
  <div>
    <a-page-header :title="$t('l_Kids')">
      <template #extra>
        <a-button @click="onUploadExcel">
          {{ $t('l_Excel') }}
        </a-button>
        <a-button type="primary" @click="onAddKid">
          {{ $t('l_Add_kid') }}
        </a-button>
      </template>
    </a-page-header>

    <a-table
      bordered
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      rowKey="id"
      :loading="loading"
      @change="handleTableChange"
      @rowClick="onRowClick"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
      </template>
    </a-table>

    <!-- Карточка ребёнка -->
    <a-modal
      v-model:open="cardVisible"
      :title="selectedKid?.full_name"
      width="800px"
      footer={null}
    >
      <div>
        <a-descriptions bordered column="1">
          <a-descriptions-item label="ИИН">{{ selectedKid?.iin }}</a-descriptions-item>
          <a-descriptions-item label="ФИО">{{ selectedKid?.full_name }}</a-descriptions-item>
          <a-descriptions-item label="Дата рождения">{{ selectedKid?.birth_date }}</a-descriptions-item>
          <a-descriptions-item label="Пол">{{ selectedKid?.gender }}</a-descriptions-item>
          <a-descriptions-item label="Адрес">{{ selectedKid?.address }}</a-descriptions-item>
        </a-descriptions>

        <div class="mt-4 flex justify-between items-center">
          <h3>История анкет</h3>
          <a-button type="primary" @click="onNewForm">Новая</a-button>
        </div>

        <!-- <a-list
          bordered
          :dataSource="formHistory"
          :renderItem="item => (
            <a-list-item>{{ item.title }} — {{ item.date }}</a-list-item>
          )"
        /> -->
      </div>
    </a-modal>

    <!-- Модал анкеты -->
    <a-modal
      v-model:open="formVisible"
      title="Анкета"
      :ok-text="$t('l_Save')"
      :cancel-text="$t('l_Cancel')"
      @ok="saveForm"
      width="900px"
    >
      <a-form layout="vertical" :model="form">
        <a-form-item v-for="field in formFields" :key="field.key" :label="field.label">
          <a-input v-model:value="form[field.key]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";

interface Kid {
  id: string;
  iin: string;
  full_name: string;
  birth_date: string;
  gender: string;
  address: string;
}

interface FormHistory {
  title: string;
  date: string;
}

const loading = ref(false);
const tableData = ref<Kid[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
});

const columns = [
  { title: "#", key: "index" },
  { title: "ИИН", dataIndex: "iin" },
  { title: "ФИО", dataIndex: "full_name" },
  { title: "Дата рождения", dataIndex: "birth_date" },
  { title: "Пол", dataIndex: "gender" },
  { title: "Адрес", dataIndex: "address" },
];

const cardVisible = ref(false);
const formVisible = ref(false);
const selectedKid = ref<Kid | null>(null);
const formHistory = ref<FormHistory[]>([]);

// Форма анкеты
const form = ref<Record<string, string>>({});
const formFields = [
  { key: "date_filled", label: "Дата заполнения анкеты" },
  { key: "risk_date", label: "Дата выявления риска" },
  { key: "breastfeeding", label: "ГВ для детей до 6 месяцев" },
  { key: "feeding_after", label: "Прикорм с 6 мес до 3 лет" },
  { key: "premature", label: "Наличие преждевременных родов" },
  { key: "dev_env", label: "Стимулирующая среда" },
  { key: "safety_home", label: "Безопасная среда дома" },
  { key: "violence", label: "Насилие / пренебрежение" },
  { key: "mental_risks", label: "Ментальные риски" },
  { key: "gross_motor", label: "Развитие крупной моторики" },
  { key: "fine_motor", label: "Развитие мелкой моторики" },
  { key: "hearing", label: "Слух" },
  { key: "weight_loss", label: "Низкий вес" },
  { key: "overweight", label: "Избыточный вес" },
  { key: "social_risks", label: "Социальные риски" },
];

function fetchKids() {
  loading.value = true;
  // здесь должен быть запрос к API
  setTimeout(() => {
    tableData.value = [
      { id: "1", iin: "123456789012", full_name: "Иван Иванов", birth_date: "2015-05-10", gender: "М", address: "Алматы" },
    ];
    pagination.value.total = 1;
    loading.value = false;
  }, 500);
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchKids();
}

function onRowClick(record: Kid) {
  selectedKid.value = record;
  formHistory.value = [
    { title: "Анкета 1", date: "01.01.2024" },
    { title: "Анкета 2", date: "15.03.2024" },
  ];
  cardVisible.value = true;
}

function onAddKid() {
  message.info("Добавление нового ребёнка");
}

function onUploadExcel() {
  message.info("Загрузка из Excel");
}

function onNewForm() {
  form.value = {};
  formVisible.value = true;
}

function saveForm() {
  message.success("Анкета сохранена");
  formVisible.value = false;
}

onMounted(fetchKids);
</script>
