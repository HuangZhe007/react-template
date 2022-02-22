import { provider } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Web3 from 'web3';
import { getDefaultProvider, sleep } from '.';
import { ACTIVE_CHAIN } from '../constants';
import { ChainConstants } from 'constants/ChainConstants';
import { getContractMethods, transformArrayToMap, getTxResult } from './aelfUtils';
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
  constructor(options: ContractProps) {
    this.address = options.contractAddress;
    this.callContract =
      ChainConstants.chainType === 'AELF' ? new AElfContractBasic(options) : new WB3ContractBasic(options);
  }

  public callViewMethod: CallViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' },
  ) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callViewMethod(functionName, paramsOption);

    return this.callContract.callViewMethod(functionName, paramsOption, callOptions);
  };

  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callSendMethod(functionName, paramsOption);
    return this.callContract.callSendMethod(functionName, account, paramsOption, sendOptions);
  };
  public callSendPromiseMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (this.callContract instanceof AElfContractBasic)
      return this.callContract.callSendPromiseMethod(functionName, paramsOption);
    return this.callContract.callSendPromiseMethod(functionName, account, paramsOption, sendOptions);
  };

  public callEstimateGas: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (this.callContract instanceof AElfContractBasic)
      return { error: { code: 404, message: 'AElfContractBasic cannot estimate gas' } };
    return this.callContract.callEstimateGas(functionName, account, paramsOption, sendOptions);
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
  // Will call a “constant” method and execute its smart contract method in the EVM without sending any transaction.
  public callSendMethod: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    try {
      const contract = this.contract;

      return await contract.methods[functionName](...(paramsOption || [])).send({ from: account, ...sendOptions });
    } catch (e) {
      return { error: e };
    }
  };
  // Will send a transaction to the smart contract and execute its method.
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
  // Will call to estimate the gas a method execution will take when executed in the EVM.
  public callEstimateGas: CallSendMethod = async (functionName, account, paramsOption, sendOptions) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    try {
      const contract = this.contract;
      return await contract.methods[functionName](...(paramsOption || [])).estimateGas({
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
  public contract: any;
  public address: string;
  public methods?: any;
  constructor(options: ContractProps) {
    const { aelfContract, contractAddress } = options;
    this.address = contractAddress;
    this.contract = aelfContract;
    this.getFileDescriptorsSet(this.address);
  }
  getFileDescriptorsSet = async (address: string) => {
    try {
      this.methods = await getContractMethods(address);
    } catch (error) {
      throw new Error(JSON.stringify(error) + 'getContractMethods');
    }
  };
  checkMethods = async () => {
    if (!this.methods) await this.getFileDescriptorsSet(this.address);
  };
  public callViewMethod: AElfCallViewMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error1' } };
    try {
      await this.checkMethods();
      // TODO upper first letter
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      const req = await this.contract[functionNameUpper].call(transformArrayToMap(inputType, paramsOption));
      if (!req.error && (req.result || req.result === null)) return req.result;
      return req;
    } catch (e) {
      return { error: e };
    }
  };

  public callSendMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    if (!ChainConstants.aelfInstance.appName) return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      const req = await this.contract[functionNameUpper](transformArrayToMap(inputType, paramsOption));
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
      const validTxId = await getTxResult(TransactionId);
      return { TransactionId: validTxId };
    } catch (e: any) {
      if (e.message) return { error: e };
      return { error: { message: e.Error || e.Status } };
    }
  };

  public callSendPromiseMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    if (!ChainConstants.aelfInstance.appName) return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      return this.contract[functionName](transformArrayToMap(this.methods[functionName], paramsOption));
    } catch (e) {
      return { error: e };
    }
  };
}
