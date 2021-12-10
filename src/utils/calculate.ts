import BigNumber from 'bignumber.js';

export function timesDecimals(a?: BigNumber.Value, decimals?: string | number) {
  if (!decimals) decimals = 18;
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return new BigNumber('0');
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.times(decimals);
  }
  return bigA.times(`1e${decimals || 18}`);
}
export function divDecimals(a?: BigNumber.Value, decimals?: string | number) {
  if (!decimals) decimals = 18;
  if (!a) return new BigNumber('0');
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a);
  if (bigA.isNaN()) return new BigNumber('0');
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.div(decimals);
  }
  return bigA.div(`1e${decimals || 18}`);
}
export function bigNumberToWeb3Input(input: BigNumber): string {
  return BigNumber.isBigNumber(input) ? input.toFixed(0) : new BigNumber(input).toFixed(0);
}
export function valueToPercentage(input?: BigNumber.Value) {
  return BigNumber.isBigNumber(input) ? input.times(100) : timesDecimals(input, 2);
}
