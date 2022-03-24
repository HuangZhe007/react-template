import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type requestConfig = {
  query?: string; //this for url parameter； example: test/:id
} & AxiosRequestConfig<any>;

export type IBaseRequest = {
  url: string;
} & requestConfig;

export type BaseConfig = string | { target: string; baseConfig: requestConfig };

export type UrlObj = { [key: string]: BaseConfig };

export type API_REQ_FUNCTION = (config?: requestConfig) => Promise<any | AxiosResponse<any>>;
