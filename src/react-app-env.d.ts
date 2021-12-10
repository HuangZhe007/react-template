/// <reference types="react-scripts" />
interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request?: (...args: any[]) => void;
    chainId?: number;
  };
  web3?: {};
  plus?: any;
}
