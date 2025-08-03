interface IUser {
  /**
   * 主键
   */
  uuid?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 确认密码
   */
  confirmPassword?: string;
}
