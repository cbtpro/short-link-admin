<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useVbenDrawer, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createSafeShortLink,
  queryOriginalLinkOptions,
  querySafeShortLink,
  updateSafeShortLink,
} from '#/api';
import { EnabledStatus } from '#/common/constants';

interface IProps {
  opened?: boolean;
  /**
   * 编辑时的唯一标识
   */
  uuid?: null | string;
  /**
   * 操作模式，新增或编辑
   */
  mode?: 'detail' | 'edit' | 'new';
}

defineOptions({
  name: 'OriginalLinkDetail',
});

const props = withDefaults(defineProps<IProps>(), {
  opened: false,
  mode: 'edit',
  uuid: '',
});

const emits = defineEmits<{
  refreshList: [];
  'update:opened': [value: boolean];
}>();

const title = computed(() => {
  const { mode } = props;
  let _title = '';
  switch (mode) {
    case 'detail': {
      _title = '安全短链接详情';
      break;
    }
    case 'edit': {
      _title = '编辑安全短链接';
      break;
    }
    case 'new': {
      _title = '新增安全短链接';
      break;
    }
    default: {
      _title = '新增安全短链接';
      break;
    }
  }
  return _title;
});

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
watch(
  () => props.opened,
  (val) => {
    if (val) drawerApi.open();
    else drawerApi.close();
  },
);

const openHandle = () => {
  emits('update:opened', true);
};

const data = ref<ISafeShortLink>({
  uuid: '',
  originalLinkId: '',
  shortCode: '',
});
const loading = ref(false);

async function fetchData(uuid: string) {
  loading.value = true;
  data.value = await querySafeShortLink(uuid);

  formInstance.setValues(data.value);
  loading.value = false;
}

function resetData() {
  // 根据你的数据结构初始化空数据
  data.value = {
    uuid: '',
    originalLinkId: '',
    shortCode: '',
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
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        api: queryOriginalLinkOptions,
        onSearch: (searchValue: string) => {
          // 获取组件实例并触发搜索
          const apiSelectRef =
            formInstance.getFieldComponentRef('originalLinkId');
          apiSelectRef?.updateParam({
            keyword: searchValue,
            page: 1,
          });
        },
        params: {},
        showSearch: true,
        filterOption: false,
        placeholder: '请选择链接',
        apiSearch: {
          show: true,
          searchName: 'keyword', // 搜索关键字参数名，自动拼接到请求中
        },
        // beforeFetch: (params) => {
        //   // params 会自动包含 keyword
        //   return {
        //     ...params,
        //     page: 1,
        //     pageSize: 20,
        //   };
        // },
        resultField: 'items',
        labelField: 'label',
        valueField: 'value',
      },
      // 字段名
      fieldName: 'originalLinkId',
      // 界面显示的label
      label: '链接',
      rules: z.string({ required_error: '请选择链接' }).nonempty('请选择链接'),
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入自定义代码',
      },
      // 字段名
      fieldName: 'shortCode',
      // 界面显示的label
      label: '自定义代码',
      rules: z
        .string()
        .optional()
        .refine((val) => !val || (val.length > 0 && val.length <= 200), {
          message: '自定义代码长度必须在 1 到 200 个字符之间',
        }),
    },
    {
      component: 'JsonEditor',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入自定义参数',
        mode: 'code',
      },
      // 字段名
      fieldName: 'customParams',
      // 界面显示的label
      label: '自定义参数',
      rules: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val) return true; // 可选，空值通过
            if (val.length === 0 || val.length > 200) return false;
            try {
              JSON.parse(val); // 验证是否是合法 JSON
              return true;
            } catch {
              return false;
            }
          },
          { message: '请输入有效的 JSON 格式，长度为 1～200 个字符' },
        ),
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入访问密码',
      },
      // 字段名
      fieldName: 'accessPassword',
      // 界面显示的label
      label: '访问密码',
      rules: z
        .string()
        .optional()
        .refine((val) => !val || (val.length > 0 && val.length <= 200), {
          message: '访问密码长度必须在 1 到 200 个字符之间',
        }),
    },
    {
      component: 'TimePicker',
      // 对应组件的参数
      componentProps: {
        placeholder: '请选择过期时间',
      },
      // 字段名
      fieldName: 'expires_at',
      // 界面显示的label
      label: '过期时间',
    },

    {
      component: 'InputNumber',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入最大访问次数',
      },
      // 字段名
      fieldName: 'max_visits',
      // 界面显示的label
      label: '最大访问次数',
    },

    {
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入IP白名单',
      },
      // 字段名
      fieldName: 'ip_whitelist',
      // 界面显示的label
      label: 'IP白名单',
    },
    {
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入IP黑名单',
      },
      // 字段名
      fieldName: 'ip_blacklist',
      // 界面显示的label
      label: 'IP黑名单',
    },

    {
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入UA白名单',
      },
      // 字段名
      fieldName: 'ua_whitelist',
      // 界面显示的label
      label: 'UA白名单',
    },
    {
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入UA黑名单',
      },
      // 字段名
      fieldName: 'ua_blacklist',
      // 界面显示的label
      label: 'UA黑名单',
    },
    {
      component: 'Textarea',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入备注',
      },
      // 字段名
      fieldName: 'remark',
      // 界面显示的label
      label: '备注',
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
async function onSubmit(values: Record<string, any>) {
  try {
    updateDataLoading.value = true;
    const uuid = props.uuid;
    if (props.mode === 'new') {
      await createSafeShortLink(values as ISafeShortLink);
      message.success('新增成功');
      resetData();
    } else if (uuid) {
      await updateSafeShortLink(uuid, values as ISafeShortLink);
      message.success('修改成功');
    }
    // 触发父组件事件，告诉它刷新列表
    emits('refreshList');
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
      } else if (
        ['detail', 'edit'].includes(mode as string) &&
        typeof uuid === 'string'
      ) {
        fetchData(uuid);
      }
    } else {
      resetData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <!-- <VbenButton @click="openHandle">Open</VbenButton> -->
    <Drawer v-model:opened="isOpen" class="w-[600px]" :title="title">
      <template v-if="loading">加载中...</template>
      <template v-else>
        <BaseForm
          v-loading="updateDataLoading"
          v-model:value="data"
          :reset-button-options="{
            loading,
          }"
          :submit-button-options="{
            loading,
          }"
        />
      </template>
    </Drawer>
  </div>
</template>
