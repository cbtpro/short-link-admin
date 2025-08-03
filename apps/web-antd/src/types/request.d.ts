interface PageFetchParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

interface IResponseBody<T> {
  data: T;
}
interface IResponseBodyByPagination<T> {
  items: T[];
  total: number;
}
