import server from 'utils/request';
import { BASE_APIS, BASE_REQ_TYPES, EXPAND_APIS, EXPAND_REQ_TYPES } from './list';
import myServer from './server';
import { IBaseRequest } from './types';
import { spliceUrl } from './utils';

function baseRequest({ url, method = 'GET', params = '', errMessage, data, query = '' }: IBaseRequest) {
  return server({
    url: spliceUrl(url, query),
    method,
    data,
    params,
  }).catch((error) => {
    console.error(error, errMessage);
    return { error: errMessage };
  });
}

myServer.parseRouter('base', BASE_APIS);

Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  myServer.parseRouter(key, value);
});

const request: BASE_REQ_TYPES & EXPAND_REQ_TYPES = Object.assign({}, myServer.base, myServer);

export { baseRequest, request };
