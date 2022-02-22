export type ChainStatus = {
  BestChainHash: string;
  BestChainHeight: number;
  ChainId: 'AELF' | 'tDVV';
  GenesisBlockHash: string;
  GenesisContractAddress: string;
  LastIrreversibleBlockHash: string;
  LastIrreversibleBlockHeight: number;
  LongestChainHash: string;
  LongestChainHeight: number;
};

export type AElfInstance = {
  appName: string;
  // TODO: Improve the chain ts type
  chain: {
    getChainStatus: any;
    contractAt: any;
    getBlock: any;
    getBlockByHeight: any;
    getBlockHeight: any;
    getChainState: any;
    getContractFileDescriptorSet: any;
    getTransactionPoolStatus: any;
    getTxResult: any;
    sendTransaction: any;
    sendTransactions: any;
    chainId: string;
  };
  httpProvider: string[];
  pure?: boolean;
  logout: any;
  login: any;
  getAddress: any;
  getSignature: any;
  getVersion: any;
};

export type PBTimestamp = {
  seconds: number;
  nanos: number;
};
