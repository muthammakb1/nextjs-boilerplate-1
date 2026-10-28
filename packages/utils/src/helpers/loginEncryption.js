/* eslint-disable no-param-reassign */
import * as CryptoJS from 'crypto-js';

/**
 * encryptAESForLogin - Encrypt a derived hd private key with a given pin
 * and return it in Base64 form
 * @param {*} text - text to be encrypted
 * @param {*} key - secret key
 * @returns - Encrypted text
 */
// Read lazily instead of at module scope so this file is safe to import during SSR
const getCryptoKey = () =>
  typeof window !== 'undefined' ? window?.msdv2?.encryptionKey : undefined;

export const encryptAESForLogin = (text, key = getCryptoKey()) => {
  if (!key) return '';
  key = CryptoJS.enc.Utf8.parse(key);
  // const iv = CryptoJS.enc.Utf8.parse(key);
  const cipher = CryptoJS.AES.encrypt(text, key, {
    // iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return cipher.toString();
};

export const decryptAESForLoginAPI = (text, key = getCryptoKey()) => {
  try {
    if (!key) return '';
    key = CryptoJS.enc.Utf8.parse(key);
    // const iv = CryptoJS.enc.Utf8.parse(key);
    const cipher = CryptoJS.AES.decrypt(text, key, {
      // iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('-error:::::decryptAESForLogin', error);
    return '';
  }
};

export const decryptAESForLogin = (text, key = getCryptoKey()) => {
  try {
    if (!key) return '';
    key = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);
    const cipher = CryptoJS.AES.decrypt(text, key, {
      iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('-error:::::decryptAESForLogin', error);
    return '';
  }
};
