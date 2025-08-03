type ISafeShortLink = IBaseEntity & {
  accessPassword?: string;
  caseInsensitive?: boolean;
  customParams?: string;
  expiresAt?: string;
  ipBlacklist?: string;
  ipWhitelist?: string;
  maxVisits?: number;
  originalLinkId: string;
  remark?: string;
  shortCode: string;
  uaBlacklist?: string;
  uaWhitelist?: string;
  uuid?: string;
  visitCount?: number;
};
