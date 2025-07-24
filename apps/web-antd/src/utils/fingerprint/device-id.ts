import CryptoJS from 'crypto-js';

export function generateDeviceId(): string {
  const navigatorInfo = window.navigator;

  const components = [
    /**
     * 浏览器及系统信息，稳定性较高
     */
    navigatorInfo.userAgent || '',
    /**
     * 浏览器语言，用户改动较少
     */
    navigatorInfo.language || '',
    /**
     * 时区，用户一般不会频繁改
     */
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  ].join('||');

  // 生成 SHA256 不可逆哈希
  const hash = CryptoJS.SHA256(components);

  return hash.toString(CryptoJS.enc.Hex);
}
