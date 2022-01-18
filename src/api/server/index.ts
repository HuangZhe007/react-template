import { BaseConfig, UrlObj, requestConfig } from 'api/types';
import { spliceUrl, service, getRequestConfig } from 'api/utils';

const myServer = new Function();

/**
 * @method parseRouter
 * @param  {string} name
 * @param  {UrlObj} urlObj
 */
myServer.prototype.parseRouter = function (name: string, urlObj: UrlObj) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

/**
 * @method send
 * @param  {BaseConfig} base
 * @param  {object} config
 * @return {Promise<any>}
 */
myServer.prototype.send = function (base: BaseConfig, config: requestConfig) {
  const { method = 'GET', query = '', data = '', params = '', errMessage } = getRequestConfig(base, config) || {};
  return service({
    url: spliceUrl(typeof base === 'string' ? base : base.target, query),
    method,
    params,
    data,
  }).catch((error) => console.error(error, errMessage));
};

export default myServer.prototype;
