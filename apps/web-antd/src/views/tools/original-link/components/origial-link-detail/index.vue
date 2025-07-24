<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useVbenForm } from '#/adapter/form';
import { useVbenDrawer } from '@vben/common-ui';
import { queryOriginalLink, updateOriginalLink } from '#/api';
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
  'update:opened': [value: boolean]
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
  originalUrl: ''
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
      } else if (mode === 'edit' && typeof uuid === 'string') {
        fetchData(uuid);
      }
    } else {
      data.value = {
        uuid: '',
        originalUrl: '',
      }; // 关闭时清空
    }
  },
  { immediate: true }
);

defineExpose({
  openHandle,
});


const [BaseForm, formInstance] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
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

async function onSubmit(values: IOriginalLink) {
  const uuid = props.uuid;
  if (uuid) {
    debugger;
    const response = await updateOriginalLink(uuid, values);
    console.log(response);
    message.success('成功');
  }
}
</script>

<template>
  <div>
    <!-- <VbenButton @click="openHandle">Open</VbenButton> -->
    <Drawer v-model:opened="isOpen" class="w-[600px]" :title="title">
      <template v-if="loading">加载中...</template>
      <template v-else>
        <BaseForm v-model:value="data" />
      </template>
    </Drawer>
  </div>
</template>
