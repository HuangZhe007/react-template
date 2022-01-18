import { API_REQ_FUNCTION, UrlObj } from './types';

export const BASE_APIS: UrlObj = {};

export const EXPAND_APIS: { [key: string]: UrlObj } = {};

export type BASE_REQ_TYPES = {
  [x in keyof typeof BASE_APIS]: API_REQ_FUNCTION;
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};
