import { requestClient } from '#/api/request';
/**
 * 查询原始链接列表
 */
export async function queryOriginalLinks(params: PageFetchParams) {
  return requestClient.get<IResponseBodyByPagination<IOriginalLink>>('/original-link/query', {
    params,
  });
}

export async function queryOriginalLink(uuid: string) {
  return requestClient.get<IOriginalLink>(`/original-link/${uuid}`, {
    params: {},
  })
}

export async function createOriginalLink(data: IOriginalLink) {
  return requestClient.post<IOriginalLink>(`/original-link`, data)
}
export async function updateOriginalLink(uuid: string, data: IOriginalLink) {
  return requestClient.put<IOriginalLink>(`/original-link/${uuid}`, data)
}
