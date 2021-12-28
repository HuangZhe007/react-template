import storages from 'storages';
import { eventBus } from 'utils';

type Info = {
  chainId: number | string;
  rpcUrls?: string[];
  chainName?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
  iconUrls?: string[];
};
/**
 * Prompt the user to add RPC as a network on Metamask, or switch to RPC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const switchNetwork = async (info: Info): Promise<boolean> => {
  const provider = window.ethereum;
  const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = info;
  eventBus.emit(storages.userChainId, info.chainId);
  if (typeof info.chainId === 'string') return true;
  if (!provider?.request) {
    console.error("Can't setup the RPC network on metamask because window.ethereum is undefined");
    return false;
  }
  try {
    if (nativeCurrency && chainName) {
      provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName,
            nativeCurrency,
            rpcUrls,
            iconUrls,
            blockExplorerUrls,
          },
        ],
      });
    } else {
      provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    }
    return true;
  } catch (error) {
    console.error('switchNetwork', error);
    return false;
  }
};
