import { createEnumHelper } from "#/utils";

/**
 * 启用状态
 */
export enum EnabledStatus {
  /**
   * 禁用
   */
  Disabled = 0,
  /**
   * 启用
   */
  Enabled = 1,
}

const ENABLED_STATUS_SOURCE = [
  { value: EnabledStatus.Enabled, label: '启用' },
  { value: EnabledStatus.Disabled, label: '禁用' },
];

// 调用工具函数生成枚举列表、Map 和 label 获取函数
export const {
  list: ENABLED_STATUS_LIST,
  map: ENABLED_STATUS_MAP,
  getLabel: getEnabledStatusLabel,
} = createEnumHelper(ENABLED_STATUS_SOURCE, { includeAll: false });

/**
 * 删除状态
 */
export enum DeletedStatus {
  /**
   * 未删除
   */
  NotDeleted = 0,
  /**
   * 已删除
   */
  Deleted = 1,
}

const DELETED_STATUS_SOURCE = [
  { value: DeletedStatus.NotDeleted, label: '未删除' },
  { value: DeletedStatus.Deleted, label: '删除' },
];

// 调用工具函数生成枚举列表、Map 和 label 获取函数
export const {
  list: DELETED_STATUS_LIST,
  map: DELETED_STATUS_MAP,
  getLabel: getDeletedStatusLabel,
} = createEnumHelper(DELETED_STATUS_SOURCE, { includeAll: false });
