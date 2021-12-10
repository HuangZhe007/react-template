import { AbstractConnector } from '@web3-react/abstract-connector';
import { coinbaseWalletIcon, metamask, walletConnectIcon } from '../assets/images';
import { injected, walletConnect, walletlink } from '../walletConnectors';
import * as MAINNET from './platform/main';
import * as KOVAN from './platform/kovan';
import * as BSC from './platform/bsc';
import * as BSCTEST from './platform/bsc-test';
import * as HECO from './platform/heco';
import * as HECOTEST from './platform/heco-test';
import * as OEC from './platform/oec';
import * as OECTEST from './platform/oec-test';
import * as POLYGON from './platform/polygon';
import * as POLYGONTEST from './platform/polygon-test';
import { SupportedChainId } from './chain';

export type ChainConstantsType =
  | typeof MAINNET
  | typeof KOVAN
  | typeof BSC
  | typeof BSCTEST
  | typeof HECO
  | typeof HECOTEST;

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  icon: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}
export type CHAIN_ID_TYPE = keyof typeof supportedChainId;

export const DEFAULT_CHAIN = SupportedChainId.KOVAN;

export const supportedChainId = {
  [SupportedChainId.MAINNET]: MAINNET,
  [SupportedChainId.KOVAN]: KOVAN,
  [SupportedChainId.BSC_MAINNET]: BSC,
  [SupportedChainId.BSC_TESTNET]: BSCTEST,
  [SupportedChainId.HECO_MAINNET]: HECO,
  [SupportedChainId.HECO_TESTNET]: HECOTEST,
  [SupportedChainId.OEC_MAINNET]: OEC,
  [SupportedChainId.OEC_TESTNET]: OECTEST,
  [SupportedChainId.POLYGON_MAINNET]: POLYGON,
  [SupportedChainId.POLYGON_TESTNET]: POLYGONTEST,
};
export const CHAIN_NAME: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.BSC_MAINNET]: 'BSC Mainnet',
  [SupportedChainId.BSC_TESTNET]: 'BSC Testnet',
  [SupportedChainId.HECO_MAINNET]: 'HECO Mainnet',
  [SupportedChainId.HECO_TESTNET]: 'HECO Testnet',
  [SupportedChainId.OEC_MAINNET]: 'OEC Mainnet',
  [SupportedChainId.OEC_TESTNET]: 'OEC Testnet',
  [SupportedChainId.POLYGON_MAINNET]: 'Polygon Mainnet',
  [SupportedChainId.POLYGON_TESTNET]: 'Polygon Testnet',
};
export const ACTIVE_CHAIN: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.BSC_MAINNET]: 'BSC Mainnet',
  [SupportedChainId.BSC_TESTNET]: 'BSC Testnet',
  [SupportedChainId.HECO_MAINNET]: 'HECO Mainnet',
  [SupportedChainId.HECO_TESTNET]: 'HECO Testnet',
  [SupportedChainId.OEC_MAINNET]: 'OEC Mainnet',
  [SupportedChainId.OEC_TESTNET]: 'OEC Testnet',
  [SupportedChainId.POLYGON_MAINNET]: 'Polygon Mainnet',
  [SupportedChainId.POLYGON_TESTNET]: 'Polygon Testnet',
};
export const PROD_CHAIN: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.BSC_MAINNET]: 'BSC Mainnet',
};
export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    icon: metamask,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: 'WalletConnect',
    icon: walletConnectIcon,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    icon: coinbaseWalletIcon,
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
};

export const NetworkContextName = 'NETWORK';

const prodNetworkList = [
  { title: CHAIN_NAME[SupportedChainId.MAINNET], info: MAINNET.CHAIN_INFO },
  { title: CHAIN_NAME[SupportedChainId.BSC_MAINNET], info: BSC.CHAIN_INFO },
  { title: CHAIN_NAME[SupportedChainId.HECO_MAINNET], info: HECO.CHAIN_INFO },
  {
    title: CHAIN_NAME[SupportedChainId.OEC_MAINNET],
    info: OEC.CHAIN_INFO,
  },
  {
    title: CHAIN_NAME[SupportedChainId.POLYGON_MAINNET],
    info: POLYGON.CHAIN_INFO,
  },
];

const testNetworkList = [
  { title: CHAIN_NAME[SupportedChainId.KOVAN], info: KOVAN.CHAIN_INFO },
  { title: CHAIN_NAME[SupportedChainId.BSC_TESTNET], info: BSCTEST.CHAIN_INFO },
  {
    title: CHAIN_NAME[SupportedChainId.HECO_TESTNET],
    info: HECOTEST.CHAIN_INFO,
  },
  {
    title: CHAIN_NAME[SupportedChainId.OEC_TESTNET],
    info: OECTEST.CHAIN_INFO,
  },
  {
    title: CHAIN_NAME[SupportedChainId.POLYGON_TESTNET],
    info: POLYGONTEST.CHAIN_INFO,
  },
];

export const networkList = process.env.REACT_APP_ENV === 'prod' ? prodNetworkList : testNetworkList;
