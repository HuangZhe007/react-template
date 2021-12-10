import BigNumber from 'bignumber.js';
import i18n from 'i18n';

const 万 = 10000;
const 亿 = 万 * 10000;
const 万亿 = 亿 * 10000;

const KUnit = 1000;
const MUnit = KUnit * 1000;
const BUnit = MUnit * 1000;
const TUnit = BUnit * 1000;

export const fixedDecimals = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_DOWN).toFixed();
};
function zhConverter(num: BigNumber, decimal = 3) {
  const abs = num.abs();
  if (abs.gt(TUnit)) {
    return fixedDecimals(num.div(万亿), decimal) + '万亿';
  } else if (abs.gt(亿)) {
    return fixedDecimals(num.div(亿), decimal) + '亿';
  } else if (abs.gt(万)) {
    return fixedDecimals(num.div(万), decimal) + '万';
  }
}
function enConverter(num: BigNumber, decimal = 3) {
  const abs = num.abs();
  if (abs.gt(TUnit)) {
    return fixedDecimals(num.div(TUnit), decimal) + 'T';
  } else if (abs.gt(BUnit)) {
    return fixedDecimals(num.div(BUnit), decimal) + 'B';
  } else if (abs.gt(MUnit)) {
    return fixedDecimals(num.div(MUnit), decimal) + 'M';
  } else if (abs.gt(KUnit)) {
    return fixedDecimals(num.div(KUnit), decimal) + 'K';
  }
}
export const unitConverter = (num?: number | BigNumber | string, decimal = 5) => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return '0';
  const conversionNum = i18n.language === 'zh' ? zhConverter(bigNum) : enConverter(bigNum);
  if (conversionNum) return conversionNum;
  return fixedDecimals(bigNum, decimal);
};
