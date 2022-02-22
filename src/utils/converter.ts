import BigNumber from 'bignumber.js';
import i18n from 'i18n';

const zhList = [
    { value: 1e12, symbol: '万亿' },
    { value: 1e8, symbol: '亿' },
    { value: 1e4, symbol: '万' },
  ],
  enList = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

export const fixedDecimal = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_DOWN).toFixed();
};

export const unitConverter = (num?: number | BigNumber | string, decimal = 5) => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return '0';
  const abs = bigNum.abs();
  const list = i18n.language === 'zh' ? zhList : enList;
  for (let i = 0; i < list.length; i++) {
    const { value, symbol } = list[i];
    if (abs.gt(value)) return fixedDecimal(bigNum.div(value), decimal) + symbol;
  }
  return fixedDecimal(bigNum, decimal);
};
