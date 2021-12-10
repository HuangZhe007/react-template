export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}
