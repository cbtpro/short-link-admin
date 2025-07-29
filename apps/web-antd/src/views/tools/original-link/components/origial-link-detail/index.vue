<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useVbenForm } from '#/adapter/form';
import { useVbenDrawer, z } from '@vben/common-ui';
import { createOriginalLink, queryOriginalLink, updateOriginalLink } from '#/api';
import { EnabledStatus } from '#/common/constants';
import { message } from 'ant-design-vue';

interface IProps {
  opened?: boolean;
  /**
   * 编辑时的唯一标识
   */
  uuid?: string | null;
  /**
   * 操作模式，新增或编辑
   */
  mode?: 'new' | 'edit' | 'detail';
}

defineOptions({
  name: 'OriginalLinkDetail'
})

const props = withDefaults(defineProps<IProps>(), {
  opened: false,
  mode: 'edit',
  uuid: '',
});

const emits = defineEmits<{
  'update:opened': [value: boolean];
  'refresh-list': [];
}>();

const title = computed(() => {
  const { mode } = props
  let _title = '';
  switch (mode) {
    default:
      _title = '新增链接';
      break;
    case 'detail':
      _title = '链接详情';
      break;
    case 'edit':
      _title = '编辑链接';
      break;
    case 'new':
      _title = '新增链接';
      break;
  }
  return _title;
})

const [Drawer, drawerApi] = useVbenDrawer({
  showConfirmButton: false,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  onClosed() {
    emits('update:opened', false);
  },
});

const isOpen = computed({
  get() {
    return props.opened;
  },
  set(val: boolean) {
    emits('update:opened', val);
    if (val) drawerApi.open();
    else drawerApi.close();
  },
});

// 同步 drawerApi 状态变化到 isOpen，避免外部状态不同步
watch(() => props.opened, (val) => {
  if (val) drawerApi.open();
  else drawerApi.close();
});

const openHandle = () => {
  emits('update:opened', true);
}


const data = ref<IOriginalLink>({
  uuid: '',
  originalUrl: '',
});
const loading = ref(false);

async function fetchData(uuid: string) {
  loading.value = true;
  data.value = await queryOriginalLink(uuid);

  formInstance.setValues(data.value);
  loading.value = false;
}

function resetData() {
  // 根据你的数据结构初始化空数据
  data.value = {
    uuid: '',
    originalUrl: '',
    // ...
  };
  if (formInstance) {
    formInstance.setValues(data.value);
  }
}

defineExpose({
  openHandle,
});


const [BaseForm, formInstance] = useVbenForm({

  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
      disabled: props.mode === 'detail',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入链接',
      },
      // 字段名
      fieldName: 'originalUrl',
      // 界面显示的label
      label: '链接',
      rules: z.string().url({ message: '请输入正确的链接' }),
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
        checkedValue: EnabledStatus.Enabled,
        unCheckedValue: EnabledStatus.Disabled,
      },
      defaultValue: EnabledStatus.Disabled,
      fieldName: 'enabled',
      label: '启用',
    },
  ],
  wrapperClass: 'grid-cols-1',
});
const isDetailMode = computed(() => props.mode === 'detail');
watch(isDetailMode, (isDisabled) => {
  formInstance?.setState({ commonConfig: { disabled: isDisabled } });
});
const updateDataLoading = ref(false);
async function onSubmit(values: IOriginalLink) {
  try {
    updateDataLoading.value = true;
    const uuid = props.uuid;
    if (props.mode === 'new') {
      await createOriginalLink(values);
      message.success('新增成功');
      resetData();
    } else if (uuid) {
      await updateOriginalLink(uuid, values);
      message.success('修改成功');
    }
    // 触发父组件事件，告诉它刷新列表
    emits('refresh-list');
  } catch (error: any) {
    message.error(error);
  } finally {
    updateDataLoading.value = false;
  }
}
/**
 * 监听打开，id，mode，切换数据
 */
watch(
  () => [props.opened, props.uuid ?? '', props.mode],
  ([opened, uuid, mode]) => {
    if (opened) {
      if (mode === 'new') {
        resetData();
      } else if (['edit', 'detail'].includes(mode as string) && typeof uuid === 'string') {
        fetchData(uuid);
      }
    } else {
      resetData();
    }
  },
  { immediate: true }
);

</script>

<template>
  <div>
    <!-- <VbenButton @click="openHandle">Open</VbenButton> -->
    <Drawer v-model:opened="isOpen" class="w-[600px]" :title="title">
      <template v-if="loading">加载中...</template>
      <template v-else>
        <BaseForm v-loading="updateDataLoading" v-model:value="data" :resetButtonOptions="{
          loading: loading
        }" :submitButtonOptions="{
          loading: loading,
        }" />
      </template>
    </Drawer>
  </div>
</template>
