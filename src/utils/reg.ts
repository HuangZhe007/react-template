/* eslint-disable no-useless-escape */

const URL_REG = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i;

export function isUrl(url: string) {
  return URL_REG.test(url);
}
