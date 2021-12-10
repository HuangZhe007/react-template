import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { NetworkConnector } from './NetworkConnector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { Web3Provider } from '@ethersproject/providers';
import { CHAIN_INFO as kovan } from 'constants/platform/kovan';
import { CHAIN_INFO as main } from 'constants/platform/main';
import { CHAIN_INFO as bscTest } from 'constants/platform/bsc-test';
import { SupportedChainId } from 'constants/chain';

const NETWORK_URLS: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: main.rpcUrl,
  [SupportedChainId.KOVAN]: kovan.rpcUrl,
  [SupportedChainId.BSC_TESTNET]: bscTest.rpcUrl,
};

export const injected = new InjectedConnector({
  supportedChainIds: Object.values(SupportedChainId)
    .filter((i) => !isNaN(Number(i)))
    .map((i) => Number(i)),
});

// default chain
export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');
// mainnet only
export const walletConnect = new WalletConnectConnector({
  rpc: NETWORK_URLS,
  qrcode: true,
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[SupportedChainId.MAINNET],
  appName: 'appName',
  // appLogoUrl: 'appLogoUrl'
});

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: SupportedChainId.MAINNET,
});
let networkLibrary: Web3Provider | undefined;

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any));
}
