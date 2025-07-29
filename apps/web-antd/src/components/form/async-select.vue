<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Select } from 'ant-design-vue';

interface Option {
  label: string;
  value: string | number;
}

interface FetchOptionsParams {
  keyword: string;
  page: number;
  pageSize: number;
}

interface FetchOptionsResult {
  items: Option[];
  total?: number;
}

const props = defineProps<{
  modelValue?: string | number;
  placeholder?: string;
  fetchOptions: (params: FetchOptionsParams) => Promise<FetchOptionsResult>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val?: string | number): void;
}>();

const options = ref<Option[]>([]);
const loading = ref(false);

const loadOptions = async (keyword = '') => {
  loading.value = true;
  try {
    const { items } = await props.fetchOptions({ keyword, page: 1, pageSize: 20 });
    options.value = items;
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadOptions());

const handleSearch = (val: string) => {
  loadOptions(val);
};
</script>

<template>
  <Select
    v-model:value="modelValue"
    :placeholder="placeholder || '请选择'"
    showSearch
    :filterOption="false"
    :options="options"
    :loading="loading"
    @search="handleSearch"
    @change="(val) => emit('update:modelValue', val)"
  />
</template>
