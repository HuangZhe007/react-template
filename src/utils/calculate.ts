import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
export function timesDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.times(decimals);
  }
  return bigA.times(`1e${decimals}`);
}
export function divDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.div(decimals);
  }
  return bigA.div(`1e${decimals}`);
}

export function bigNumberToWeb3Input(input: BigNumber): string {
  return BigNumber.isBigNumber(input) ? input.toFixed(0) : new BigNumber(input).toFixed(0);
}
export function valueToPercentage(input?: BigNumber.Value) {
  return BigNumber.isBigNumber(input) ? input.times(100) : timesDecimals(input, 2);
}
