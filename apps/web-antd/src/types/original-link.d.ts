type IOriginalLink = IBaseEntity & {
  deleted?: boolean | number;
  enabled?: boolean | number;
  originalUrl: string;
  uuid?: string;
};
