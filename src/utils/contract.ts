import { provider } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Web3 from 'web3';
import { getDefaultProvider, sleep } from '.';
import { ACTIVE_CHAIN } from '../constants';
import { ChainConstants } from 'constants/ChainConstants';
import { getContractMethods, transformArrayToMap, getTxResult } from './aelfUtils';
import { ChainType } from 'types';
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

export interface ContractProps {
  contractABI?: AbiItem[];
  provider?: provider;
  contractAddress: string;
  chainId?: number;
  aelfContract?: any;
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
  public address?: string;
  public callContract: WB3ContractBasic | AElfContractBasic;
  public contractType: ChainType;
  constructor(options: ContractProps) {
    this.address = options.contractAddress;
    this.callContract =
      ChainConstants.chainType === 'ELF' ? new AElfContractBasic(options) : new WB3ContractBasic(options);
    this.contractType = ChainConstants.chainType;
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' },
  ) => {
    if (ChainConstants.chainType === 'ELF') return this.callContract.callViewMethod(functionName, paramsOption);

    return this.callContract.callViewMethod(functionName, paramsOption, callOptions);
  };

  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (ChainConstants.chainType === 'ELF') return this.callContract.callSendMethod(functionName, paramsOption);

    return this.callContract.callSendMethod(functionName, account, paramsOption, sendOptions);
  };
  public callSendPromiseMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (ChainConstants.chainType === 'ELF') return this.callContract.callSendPromiseMethod(functionName, paramsOption);

    return this.callContract.callSendPromiseMethod(functionName, account, paramsOption, sendOptions);
  };
}

export class WB3ContractBasic {
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
    if (!this.contract) return { error: { code: 401, message: 'Contract init error4' } };
    try {
      const contract = this.contract;

      return await contract.methods[functionName](...(paramsOption || [])).send({ from: account, ...sendOptions });
    } catch (e) {
      return { error: e };
    }
  };
  public callSendPromiseMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error5' } };
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

type AElfCallViewMethod = (functionName: string, paramsOption?: any) => Promise<any | ErrorMsg>;

type AElfCallSendMethod = (functionName: string, paramsOption?: any) => Promise<ErrorMsg> | Promise<any>;

export class AElfContractBasic {
  public aelfContract: any;
  public address: string;
  public methods?: any;
  constructor(options: ContractProps) {
    const { aelfContract, contractAddress } = options;
    this.address = contractAddress;
    this.aelfContract = aelfContract;
    this.getFileDescriptorsSet(this.address);
  }
  getFileDescriptorsSet = async (address: string) => {
    try {
      this.methods = await getContractMethods(address);
    } catch (error) {
      throw new Error(JSON.stringify(error) + 'address:' + address + 'Contract:' + 'getContractMethods');
    }
  };
  checkMethods = async () => {
    if (!this.methods) await this.getFileDescriptorsSet(this.address);
  };
  public callViewMethod: AElfCallViewMethod = async (functionName, paramsOption) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error1' } };
    try {
      await this.checkMethods();
      // TODO upper first letter
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      console.log(
        this.aelfContract,
        transformArrayToMap(inputType, paramsOption),
        inputType,
        functionNameUpper,
        '===callViewMethod',
      );

      const req = await this.aelfContract[functionNameUpper].call(transformArrayToMap(inputType, paramsOption));
      if (!req?.error && (req?.result || req?.result === null)) return req.result;
      return req;
    } catch (e) {
      return { error: e };
    }
  };

  public callSendMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error2' } };
    if (!ChainConstants.aelfInstance?.appName && !ChainConstants.aelfInstance.connected)
      return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      console.log(inputType, transformArrayToMap(inputType, paramsOption), functionNameUpper, '===callSendMethod');

      const req = await this.aelfContract[functionNameUpper](transformArrayToMap(inputType, paramsOption));
      if (req.error) {
        return {
          error: {
            code: req.error.message?.Code || req.error,
            message: req.errorMessage?.message || req.error.message?.Message,
          },
        };
      }
      const { TransactionId } = req.result || req;
      await sleep(1000);
      const result = await getTxResult(TransactionId);
      return result;
    } catch (e: any) {
      if (e.message) return { error: e };
      return { error: { message: e.Error || e.Status } };
    }
  };

  public callSendPromiseMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.aelfContract) return { error: { code: 401, message: 'Contract init error3' } };
    if (!ChainConstants.aelfInstance?.appName) return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      return this.aelfContract[functionName](transformArrayToMap(this.methods[functionName], paramsOption));
    } catch (e) {
      return { error: e };
    }
  };
}
