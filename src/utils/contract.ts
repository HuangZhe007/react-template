import { provider } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Web3 from 'web3';
import { getDefaultProvider } from '.';
import { ACTIVE_CHAIN } from '../constants';
import { ChainConstants } from 'constants/ChainConstants';
export interface AbiType {
  internalType?: string;
  name?: string;
  type?: string;
  components?: AbiType[];
}
export interface AbiItem {
  constant?: boolean;
  inputs?: AbiType[];
  name?: string;
  outputs?: AbiType[];
  payable?: boolean;
  stateMutability?: string;
  type?: string;
}

interface ContractProps {
  contractABI?: AbiItem[];
  provider?: provider;
  contractAddress: string;
  chainId?: number;
}

interface ErrorMsg {
  error: {
    name?: string;
    code: number;
    message: string;
  };
}

type InitContract = (provider: provider, address: string, ABI: AbiItem) => Contract;

type InitViewOnlyContract = (address: string, ABI: AbiItem) => Contract;

type CallViewMethod = (
  functionName: string,
  paramsOption?: any,
  callOptions?: {
    defaultBlock: number | string;
    options?: any;
    callback?: any;
  },
) => Promise<any | ErrorMsg>;

type CallSendMethod = (
  functionName: string,
  account: string,
  paramsOption?: any,
  sendOptions?: SendOptions,
) => Promise<ErrorMsg> | Promise<any>;

export type ContractBasicErrorMsg = ErrorMsg;
export class ContractBasic {
  public contract: Contract | null;
  public contractForView: Contract;
  public address?: string;
  public provider?: provider;
  public chainId?: number;
  constructor(options: ContractProps) {
    const { contractABI, provider, contractAddress, chainId } = options;
    const contactABITemp = contractABI;

    this.contract =
      contractAddress && provider ? this.initContract(provider, contractAddress, contactABITemp as AbiItem) : null;

    this.contractForView = this.initViewOnlyContract(contractAddress, contactABITemp as AbiItem);
    this.address = contractAddress;
    this.provider = provider;
    this.chainId = chainId;
  }

  public initContract: InitContract = (provider, address, ABI) => {
    const web3 = new Web3(provider);
    return new web3.eth.Contract(ABI as any, address);
  };
  public initViewOnlyContract: InitViewOnlyContract = (address, ABI) => {
    const defaultProvider = getDefaultProvider();
    const defaultWeb3 = new Web3(defaultProvider);
    return new defaultWeb3.eth.Contract(ABI as any, address);
  };

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' },
  ) => {
    try {
      const chainId = this.chainId || ChainConstants.chainId;
      const { defaultBlock, options } = callOptions;
      let contract = this.contractForView;
      // active chain
      if (ACTIVE_CHAIN[chainId]) contract = this.contract || this.contractForView;
      // BlockTag
      contract.defaultBlock = defaultBlock;

      return await contract.methods[functionName](...(paramsOption || [])).call(options);
    } catch (e) {
      return { error: e };
    }
  };

  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    try {
      const contract = this.contract;

      return await contract.methods[functionName](...(paramsOption || [])).send({ from: account, ...sendOptions });
    } catch (e) {
      return { error: e };
    }
  };
  public callSendPromiseMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    try {
      const contract = this.contract;

      return contract.methods[functionName](...(paramsOption || [])).send({
        from: account,
        ...sendOptions,
      });
    } catch (e) {
      return { error: e };
    }
  };
}
