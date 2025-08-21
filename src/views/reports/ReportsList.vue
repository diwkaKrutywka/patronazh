<template>
  <div class="p-4">
    <a-page-header :title="$t('l_Reports')"> </a-page-header>

    <a-typography-text type="secondary" class="mr-4">
      {{ $t('report_hint_select_filter') }}
    </a-typography-text>

    <!-- Переключатель -->
    <a-radio-group v-model:value="dateMode" class="mb-4">
      <a-radio-button value="month-year">{{ $t('report_mode_month_year') }}</a-radio-button>
      <a-radio-button value="range">{{ $t('report_mode_range') }}</a-radio-button>
    </a-radio-group>

    <div class="flex gap-4 mt-4 flex-col md:flex-row">
      <!-- Вариант 1: месяц + год -->
      <div class="flex gap-2 mb-4 md:mb-0">
        <a-select
          v-model:value="month"
          :placeholder="$t('report_placeholder_month')"
          style="width: 150px"
          :disabled="dateMode !== 'month-year'"
        >
          <a-select-option v-for="m in 12" :key="m" :value="m">
            {{ m }}
          </a-select-option>
        </a-select>
        <a-input-number
          v-model:value="year"
          :min="2020"
          :max="dayjs().year()"
          :placeholder="$t('report_placeholder_year')"
          style="width: 120px"
          :disabled="dateMode !== 'month-year'"
        />
      </div>

      <!-- Вариант 2: диапазон дат -->
      <div class="mb-4 md:mb-0">
        <a-range-picker
          v-model:value="dateRange"
          format="YYYY-MM-DD"
          :disabled-date="disabledFutureDate"
          :allow-clear="true"
          :disabled="dateMode !== 'range'"
        />
      </div>
    </div>
    <!-- Кнопки / Карточки -->
    <a-row :gutter="16" class="mt-6">
      <a-col :xs="24" :md="12" :xl="8" class="mb-4">
        <a-card :hoverable="true" :style="{ border: '1px solid #1677ff' }" style="min-height: 220px">
          <template #title>
            <div class="flex items-center gap-2">
              <FileExcelOutlined />
              <span>{{ $t('report_pkg_progressive_title') }}</span>
            </div>
          </template>
          <a-typography-paragraph class="mb-4">
            {{ $t('report_pkg_progressive_desc') }}
          </a-typography-paragraph>
          <a-space>
            <a-button
              type="primary"
              size="large"
              :loading="downloading === 'progressive-package'"
              :disabled="!!downloading && downloading === 'progressive-package'"
              @click="downloadReport('progressive-package')"
            >
              <span class="material-symbols-outlined">
                download
                <span>{{ $t('report_btn_download') }}</span>
              </span>
            </a-button>
          </a-space>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12" :xl="8" class="mb-4">
        <a-card :hoverable="true" :style="{ border: '1px solid #1677ff' }" style="min-height: 220px">
          <template #title>
            <div class="flex items-center gap-2">
              <FileExcelOutlined />
              <span>{{ $t('report_pkg_universal_title') }}</span>
            </div>
          </template>
          <a-typography-paragraph class="mb-4">
            {{ $t('report_pkg_universal_desc') }}
          </a-typography-paragraph>
          <a-space>
            <a-button
              type="primary"
              size="large"
              :loading="downloading === 'universal-package'"
              :disabled="!!downloading && downloading === 'universal-package'"
              @click="downloadReport('universal-package')"
            >
              <span class="material-symbols-outlined">
                download
                <span>{{ $t('report_btn_download') }}</span>
              </span>
            </a-button>
          </a-space>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12" :xl="8" class="mb-4">
        <a-card :hoverable="true" :style="{ border: '1px solid #1677ff'}" style="min-height: 220px">
          <template #title>
            <div class="flex items-center gap-2">
              <FileExcelOutlined />
              <span>{{ $t('report_nurse_diary_title') }}</span>
            </div>
          </template>
          <a-typography-paragraph class="mb-3">
            {{ $t('report_nurse_diary_desc') }}
          </a-typography-paragraph>
         
          <a-space>
            <a-button
              type="primary"
              size="large"
              :loading="downloading === 'nurse-diary-universal'"
              :disabled="!!downloading && downloading === 'nurse-diary-universal'"
              @click="downloadReport('nurse-diary-universal')"
            >
              <span class="material-symbols-outlined">
                download
                <span>{{ $t('report_btn_download') }}</span>
              </span>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ReportsApi } from "../../api/reports";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { FileExcelOutlined } from "@ant-design/icons-vue";

const dateMode = ref<"month-year" | "range">("range");
const dateRange = ref<[string, string] | null>(null);
const month = ref<number | null>(null);
const year = ref<number | null>(dayjs().year());
const downloading = ref<string | null>(null);

const disabledFutureDate = (current: any) =>
  current && current > dayjs().endOf("day");

async function downloadReport(type: string) {
  try {
    downloading.value = type;
    const params: Record<string, any> = {};
    let suffix = "";

    if (dateMode.value === "month-year") {
      if (!month.value || !year.value) {
        message.warning("Выберите месяц и год");
        return;
      }
      params.month = month.value;
      params.year = year.value;
      suffix = `_M${month.value}-${year.value}`;
    } else if (dateMode.value === "range") {
      if (!dateRange.value) {
        message.warning("Выберите диапазон дат");
        return;
      }
      const start = dayjs(dateRange.value[0]).format("YYYY-MM-DD");
      const end = dayjs(dateRange.value[1]).format("YYYY-MM-DD");
      params.start_date = start;
      params.end_date = end;
      suffix = `_${start}-${end}`;
    }

    const response = await ReportsApi(`${type}/`, params, "GET", {
      fileDownload: true,
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}${suffix}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    message.success("Отчёт успешно скачан");
  } catch (e) {
    message.error("Ошибка при скачивании отчёта");
  } finally {
    downloading.value = null;
  }
}
</script>
