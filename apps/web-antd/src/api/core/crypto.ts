import { useAppConfig } from '@vben/hooks';

import CryptoJS from 'crypto-js';

const { secretKey } = useAppConfig(import.meta.env, import.meta.env.PROD);

/**
 * 加密数据函数
 *
 * 本函数使用AES加密算法对传入的数据进行加密。它首先将数据转换为JSON字符串，
 * 然后使用预设的密钥进行加密。加密完成后，将加密的字符串返回。
 *
 * @param data 待加密的字符串数据
 * @returns 返回加密后的字符串
 */
export const encryptData = (data: string) => {
  // 使用CryptoJS的AES加密方法加密数据，并将加密结果转换为字符串
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey,
  ).toString();
  return ciphertext;
};
/**
 * 解密数据。
 *
 * 该函数使用AES加密算法解密经过加密的字符串，以恢复原始数据。
 * 它依赖于CryptoJS库来执行加密解密操作。
 *
 * @param ciphertext 加密的字符串，使用AES算法加密。
 * @returns 解密后的数据，以JSON对象的形式返回。
 */
export const decryptData = (ciphertext: string) => {
  // 使用AES算法和预设的密钥解密密文。
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  // 将解密后的字节序列解析为UTF-8编码的字符串，并进一步解析为JSON对象。
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
