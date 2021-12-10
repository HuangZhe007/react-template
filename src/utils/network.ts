import storages from 'storages';
import { eventBus } from 'utils';

type Info = {
  chainId: number;
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
  if (!provider?.request) {
    console.error("Can't setup the RPC network on metamask because window.ethereum is undefined");
    eventBus.emit(storages.userChainId, info.chainId);
    return false;
  }

  const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = info;
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
