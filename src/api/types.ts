import { AxiosResponse, Method } from 'axios';

export type requestConfig = {
  method?: Method;
  params?: any;
  data?: any;
  errMessage?: string;
  query?: string;
};

export type API_REQ_FUNCTION = (config?: requestConfig) => Promise<any | AxiosResponse<any>>;

export interface IBaseRequest {
  url: string;
  method?: Method;
  params?: any;
  data?: any;
  errMessage?: string;
  query?: string; //this for url parameter； example: test/:id
}
