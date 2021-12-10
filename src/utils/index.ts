import { ChainConstants } from 'constants/ChainConstants';
import Web3 from 'web3';
import { getAddress } from '@ethersproject/address';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { supportedChainId } from 'constants/index';
import EventEmitter from 'events';

export const eventBus = new EventEmitter();

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}
// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string | null): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getEtherscanLink(data: string, type: 'transaction' | 'token' | 'address' | 'block'): string {
  const prefix = ChainConstants.constants.CHAIN_INFO.exploreUrl;
  switch (type) {
    case 'transaction': {
      return `${prefix}tx/${data}`;
    }
    case 'token': {
      return `${prefix}token/${data}`;
    }
    case 'block': {
      return `${prefix}block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}address/${data}`;
    }
  }
}

const Provider = Object.values(supportedChainId).map((i) => {
  return new Web3.providers.HttpProvider(i.CHAIN_INFO.rpcUrl, {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
  });
});
const chainKeys = Object.keys(supportedChainId);

export const getProvider = (chainId: number) => {
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

export const isEqAddress = (a1?: string, a2?: string) => {
  if (!isAddress(a1) || !isAddress(a2)) return false;
  try {
    return getAddress(a1 || '') === getAddress(a2 || '');
  } catch (error) {
    return false;
  }
};

export function shortenAddress(address: string | null, chars = 4): string {
  const parsed = address;
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
