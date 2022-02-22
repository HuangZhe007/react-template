import { ChainConstants } from 'constants/ChainConstants';
import { supportedChainId } from 'constants/index';
import Web3 from 'web3';
const Provider = Object.values(supportedChainId).map((i) => {
  return new Web3.providers.HttpProvider(i.CHAIN_INFO.rpcUrl, {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
  });
});
const chainKeys = Object.keys(supportedChainId);
export const getProvider = (chainId?: number) => {
  const index = chainKeys.findIndex((i) => Number(i) === chainId);
  if (index !== -1) return Provider[index];
};

export const getDefaultProvider = () => {
  const defaultProvider = new Web3.providers.HttpProvider(ChainConstants.constants.CHAIN_INFO.rpcUrl, {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
  });
  return defaultProvider;
};
