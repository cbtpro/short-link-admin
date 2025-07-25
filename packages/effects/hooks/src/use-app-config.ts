import type {
  ApplicationConfig,
  VbenAdminProAppConfigRaw,
} from '@vben/types/global';

const getBoolean = (value: string | undefined) => value === 'true';

const getString = (value: string | undefined, fallback: string) =>
  value ?? fallback;

const getNumber = (value: string | undefined, fallback: number) =>
  Number(value) || fallback;
/**
 * 由 vite-inject-app-config 注入的全局配置
 */
export function useAppConfig(
  env: Record<string, any>,
  isProduction: boolean,
): ApplicationConfig {
  // 生产环境下，直接使用 window._VBEN_ADMIN_PRO_APP_CONF_ 全局变量
  const config = isProduction
    ? window._VBEN_ADMIN_PRO_APP_CONF_
    : (env as VbenAdminProAppConfigRaw);

  const {
    VITE_GLOB_API_URL,
    VITE_GLOB_SECRET_KEY,
    VITE_GLOB_ENABLED_ENCRYPT_DATA,
    VITE_GLOB_ENABLED_DECRYPT_DATA,
  } = config;

  return {
    apiURL: VITE_GLOB_API_URL,
    /**
     * 接口加密解密密钥
     */
    secretKey: VITE_GLOB_SECRET_KEY,
    enabledEncryptData: getBoolean(VITE_GLOB_ENABLED_DECRYPT_DATA),
    enabledDecryptData: getBoolean(VITE_GLOB_ENABLED_ENCRYPT_DATA),
  };
}
