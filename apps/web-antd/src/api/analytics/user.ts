import { requestClient } from "../request";

/**
 * 查询用户数量
 */
export async function countAllUser() {
  return requestClient.post<number>('/user/count');
}
