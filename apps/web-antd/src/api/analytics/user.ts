import { requestClient } from "../request";

/**
 * 查询用户数量
 */
export async function findAllUser() {
  return requestClient.get<any[]>('/user/all');
}
