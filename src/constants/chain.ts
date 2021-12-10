export enum SupportedChainId {
  MAINNET = 1,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  HECO_MAINNET = 128,
  HECO_TESTNET = 256,
  OEC_MAINNET = 66,
  OEC_TESTNET = 65,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
}

export type NativeToken = {
  name: string;
  symbol: string;
  decimals: number;
};
