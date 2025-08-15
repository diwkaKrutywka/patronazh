<template>
    <div>
      <a-page-header title="Reports" />
  
      <a-space style="margin-bottom: 16px;">
        <a-select v-model:value="selectedCategory" style="width: 200px" @change="fetchData">
          <a-select-option value="children">Children</a-select-option>
          <a-select-option value="pregnant-women">Pregnant Women</a-select-option>
        </a-select>
      </a-space>
  
      <a-tabs v-model:activeKey="activeTab" @change="fetchData">
        <a-tab-pane key="progressive-package" tab="Progressive Package" />
        <a-tab-pane key="universal-package" tab="Universal Package" />
      </a-tabs>
  
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
        bordered
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const activeTab = ref('progressive-package')
  const selectedCategory = ref('children')
  const tableData = ref<any[]>([])
  const loading = ref(false)
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    // Здесь добавь остальные поля из API
  ]
  
  const fetchData = async () => {
    loading.value = true
    try {
      const url = `/api/v1/reports/${selectedCategory.value}/${activeTab.value}/`
      const res = await axios.get(url)
      tableData.value = res.data
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // загружаем при первом рендере
  fetchData()
  </script>
  