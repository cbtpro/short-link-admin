type ISafeShortLink = IBaseEntity & {
  uuid?: string;
  originalLinkId: string;
  shortCode: string;
  customParams?: string;
  accessPassword?: string;
  caseInsensitive?: boolean;
  expiresAt?: string;
  maxVisits?: number;
  visitCount?: number;
  ipWhitelist?: string;
  ipBlacklist?: string;
  uaWhitelist?: string;
  uaBlacklist?: string;
  remark?: string;
}
