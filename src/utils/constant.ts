import CryptoJS from "crypto-js";

const AES_KEY = "29859560262728672401yrzp";
const verify_target =
  "4esKeuFHWFtteUb/GbTR1fQ420nzurjL/5VvRstdVHYK7F9MXyYE5BCelQV7tu+L";
const IV = "yr21yysyangyishu";

export const TOKENS = {
  ACCESS_TOKEN: "",
};

export const updateToken = (token: string) => {
  TOKENS.ACCESS_TOKEN = token;
};

export const lock = (str: string) => {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV);
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const eqLock = (data: string) => {
  return data === verify_target;
};
