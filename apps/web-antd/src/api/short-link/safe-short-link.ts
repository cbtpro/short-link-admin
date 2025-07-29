import { requestClient } from '#/api/request';
/**
 * 查询原始链接列表
 */
export async function querySafeShortLinks(data: PageFetchParams) {
  return requestClient.post<IResponseBodyByPagination<ISafeShortLink>>('/safe-short-link/query', data);
}

export async function querySafeShortLink(uuid: string) {
  return requestClient.get<ISafeShortLink>(`/safe-short-link/${uuid}`, {
    params: {},
  })
}

export async function createSafeShortLink(data: ISafeShortLink) {
  return requestClient.post<ISafeShortLink>(`/safe-short-link`, data)
}
export async function updateSafeShortLink(uuid: string, data: ISafeShortLink) {
  return requestClient.put<ISafeShortLink>(`/safe-short-link/${uuid}`, data)
}
export async function deleteSafeShortLink(uuid: string) {
  return requestClient.delete<ISafeShortLink>(`/safe-short-link/${uuid}`)
}

export async function undoDeleteSafeShortLink(uuid: string) {
  return requestClient.post<ISafeShortLink>(`/safe-short-link/${uuid}/undo`)
}
