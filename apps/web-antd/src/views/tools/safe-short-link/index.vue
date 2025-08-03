<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  VxeGridListeners,
  VxeGridPropTypes,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal, notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteSafeShortLink,
  querySafeShortLinks,
  undoDeleteSafeShortLink,
} from '#/api';
import {
  DELETED_STATUS_LIST,
  ENABLED_STATUS_LIST,
  OrderType,
} from '#/common/constants';

import OriginalLinkDetail from './components/origial-link-detail/index.vue';

defineOptions({
  name: 'SafeShortLink',
});

interface PaginationInfo {
  page?: number;
  pageSize?: number;
  sortList?: {
    field: string;
    order: OrderType;
  }[];
}
type RowType = {
  createdBy?: string;
  createdTime?: string;
  deleted?: number;
  enabled?: number;
  /**
   * 链接关键字
   */
  keyword?: string;
  updatedBy?: string;
  updatedTime?: string;
  uuid?: string;
} & PaginationInfo;

const DEFAULT_RANGE_7_DAYS = [
  dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
];
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
      defaultValue: DEFAULT_RANGE_7_DAYS,
      fieldName: 'createdTime',
      label: '创建时间',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      component: 'RangePicker',
      // defaultValue: DEFAULT_RANGE_7_DAYS,
      fieldName: 'updatedTime',
      label: '更新时间',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
function buildQueryParams(
  page: VxeGridPropTypes.ProxyAjaxQueryPageParams,
  formValues: {
    [key: string]: any;
  },
  sorts?: VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams<RowType>[],
): RowType {
  const sortList = (sorts || []).map((item) => {
    const { field, order } = item;
    return { field, order };
  });
  const params: RowType = {
    page: page.currentPage,
    pageSize: page.pageSize,
    sortList: sortList.map((item) => ({
      field: item.field,
      order: item.order as OrderType,
    })),
    ...formValues,
  };
  return params;
}

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  sortConfig: {
    remote: true,
    trigger: 'cell',
    showIcon: true,
    multiple: true,
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      align: 'left',
      field: 'originalLink',
      title: '原始链接',
      cellRender: { name: 'originalLinkRender' },
    },
    { align: 'left', field: 'shortCode', title: '短链接代码' },
    {
      align: 'left',
      width: 100,
      field: 'enabled',
      title: '启用',
      sortable: true,
      cellRender: { name: 'enabledRender' },
    },
    {
      align: 'left',
      width: 100,
      field: 'deleted',
      title: '删除',
      sortable: true,
      cellRender: { name: 'deletedRender' },
    },
    {
      align: 'left',
      field: 'createdTime',
      formatter: 'formatDateTime',
      title: '创建时间',
      sortable: true,
    },
    {
      align: 'left',
      field: 'updatedTime',
      formatter: 'formatDateTime',
      title: '更新时间',
      sortable: true,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      // width: 120,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page, sorts }, formValues) => {
        const data = buildQueryParams(page, formValues, sorts);
        return await querySafeShortLinks(data as PageFetchParams);
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
// const sortParams = ref<{ field: string; order: string }[]>([]);

const gridEvents: VxeGridListeners<RowType> = {
  sortChange() {
    // sortParams.value = sortList.map(({ field, order }) => ({
    //   field,
    //   order: order?.toLowerCase() || OrderType.ASC, // ASC => asc
    // }));
    extendedApi.query();
  },
};
const [Grid, extendedApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

const opened = ref(false);
const toggleOpened = (row: RowType) => {
  opened.value = !opened.value;
  currentUUID.value = row?.uuid;
  mode.value = 'edit';
};
const createNewOriginLink = () => {
  opened.value = true;
  currentUUID.value = null;
  mode.value = 'new';
};
const detailOriginalLink = async (row: RowType) => {
  opened.value = true;
  currentUUID.value = row?.uuid;
  mode.value = 'detail';
};
const mode = ref<'detail' | 'edit' | 'new'>('new');
const currentUUID = ref<null | string | undefined>('');

const showUndoDeleteNotigication = (uuid: string) => {
  const key = `delete_${uuid}`;

  const btn = h(
    'button',
    {
      style: 'margin-left: 12px; color: #1677ff;',
      onClick: async () => {
        await undoDeleteSafeShortLink(uuid);
        notification.close(key);
        message.success('已恢复');
        extendedApi.reload();
      },
    },
    '撤销',
  );

  notification.open({
    message: '提示',
    description: h('span', {}, ['已删除', btn]),
    key,
    duration: 5,
  });
};
const deleteOriginalLinkHandle = async (row: RowType) => {
  if (!row.uuid) {
    return;
  }
  Modal.confirm({
    title: '确认删除该链接？',
    content: '此操作不可撤销，是否继续？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        if (!row.uuid) {
          return;
        }
        await deleteSafeShortLink(row.uuid);
        message.success('删除成功');
        showUndoDeleteNotigication(row.uuid);
        extendedApi.reload();
      } catch (error: any) {
        message.error(error?.message || '删除失败');
      }
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Button
          class="mr-2 flex items-center justify-center"
          type="primary"
          shape="circle"
          @click="createNewOriginLink"
        >
          <template #icon>
            <span class="icon-[mdi--plus]"></span>
          </template>
        </Button>
        <!-- <Button class="mr-2" type="primary" @click="() => extendedApi.query()">
          刷新当前页面
        </Button>
        <Button type="primary" @click="() => extendedApi.reload()">
          刷新并返回第一页
        </Button> -->
      </template>
      <template #action="{ row }">
        <Button
          @click="detailOriginalLink(row)"
          type="link"
          :disabled="!!row.deleted"
        >
          详情
        </Button>
        <Button
          v-if="!row.deleted"
          @click="toggleOpened(row)"
          type="link"
          :disabled="!!row.deleted"
        >
          编辑
        </Button>
        <Button
          v-if="!row.deleted"
          @click="deleteOriginalLinkHandle(row)"
          type="link"
        >
          删除
        </Button>
      </template>
    </Grid>
    <OriginalLinkDetail
      v-model:opened="opened"
      :mode="mode"
      :uuid="currentUUID"
      @refresh-list="extendedApi.reload"
    />
  </Page>
</template>
