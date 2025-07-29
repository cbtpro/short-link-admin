interface IBaseEntity {
  /**
   * 主键
   */
  uuid?: string;
  /**
   * 乐观锁
   */
  revision?: number;
  /**
   * 创建人
   */
  createdBy?: string;
  /**
   * 创建时间
   */
  createdTime?: Date;
  /**
   * 更新人
   */
  updatedBy?: string;
  /**
   * 更新时间
   */
  updatedTime?: Date;
  /**
   * 启用状态
   */
  enabled?: number;
  /**
   * 删除状态
   */
  deleted?: number | null;
}
