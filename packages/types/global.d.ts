import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta { }
}

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  /**
   * 接口请求解密密钥
   */
  VITE_GLOB_SECRET_KEY: string;
  /**
   * 是否开启加密
   */
  VITE_GLOB_ENABLED_ENCRYPT_DATA: string;
  /**
   * 是否开启解密
   */
  VITE_GLOB_ENABLED_DECRYPT_DATA: string;

}

export interface ApplicationConfig {
  apiURL: string;
  secretKey: string;
  enabledEncryptData: boolean;
  enabledDecryptData: boolean;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
