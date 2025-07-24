<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { Page, type VbenFormProps } from '@vben/common-ui';
import { useVbenVxeGrid, type VxeTableGridOptions } from '#/adapter/vxe-table';
import dayjs from 'dayjs';
import OriginalLinkDetail from './components/origial-link-detail/index.vue'
import { DELETED_STATUS_LIST, ENABLED_STATUS_LIST } from '#/common/constants';
import { queryOriginalLinks } from '#/api';
import { ref } from 'vue';

defineOptions({
  name: 'OriginalLink',
})

enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}
interface PaginationInfo {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: OrderType;
}
type RowType = PaginationInfo & {
  uuid?: string;
  /**
   * 链接关键字
   */
  keyword?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  enabled?: number;
  deleted?: number;
}
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema: [
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'keyword',
      label: '链接关键字',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ENABLED_STATUS_LIST,
        placeholder: '请选择',
      },
      fieldName: 'enabled',
      label: '启用',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: DELETED_STATUS_LIST,
        placeholder: '请选择',
      },
      fieldName: 'deleted',
      label: '删除',
    },
    {
      component: 'RangePicker',
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'createdTime',
      label: '创建时间',
    },
    {
      component: 'RangePicker',
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'updatedTime',
      label: '更新时间',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', field: 'originalUrl', title: '链接' },
    { align: 'left', width: 100 ,  field: 'enabled', title: '启用', cellRender: { name: 'enabledRender' }, },
    { align: 'left', width: 100 ,  field: 'deleted', title: '删除', cellRender: { name: 'deletedRender' }, },
    { align: 'left',  field: 'createdTime', formatter: 'formatDateTime', title: '创建时间' },
    { align: 'left',  field: 'updatedTime', formatter: 'formatDateTime', title: '更新时间' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 120,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await queryOriginalLinks({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};
const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const opened = ref(false);
const toggleOpened = (row: RowType) => {
  opened.value = !opened.value;
  currentUUID.value = row?.uuid;
}
const currentUUID = ref<string | undefined | null>('');
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <Button @click="toggleOpened(row)" type="link" :disabled="!row.enabled && !row.deleted">编辑</Button>
      </template>
    </Grid>
    <OriginalLinkDetail v-model:opened="opened" :uuid="currentUUID" />
  </Page>
</template>
