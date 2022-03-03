import { message } from 'antd';
import { getExploreLink, shortenString, sleep } from 'utils';
import BigNumber from 'bignumber.js';
import i18n from 'i18n';
import { ContractBasic } from './contract';
import AElf from './aelf';
import { COMMON_PRIVATE } from 'constants/aelf';
import { ChainConstants } from 'constants/ChainConstants';
import storages from 'storages';
import { baseRequest } from 'api';
import descriptor from '@aelfqueen/protobufjs/ext/descriptor';
import { timesDecimals } from './calculate';
const Wallet = AElf.wallet;
let wallet: any = null,
  aelf: any = null;

export function getAElf() {
  if (aelf) return aelf;
  aelf = new AElf(new AElf.providers.HttpProvider(ChainConstants.constants.CHAIN_INFO.rpcUrl));
  return aelf;
}
export function getWallet() {
  if (wallet) return wallet;
  wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  return wallet;
}

export const approveELF = async (address: string, tokenContract: ContractBasic, symbol = 'ELF') => {
  const approveResult = await tokenContract.callSendMethod('Approve', '', [
    address,
    symbol,
    '10000000000000000000000000',
  ]);
  if (approveResult.error) {
    message.error(approveResult.error.message || approveResult?.errorMessage?.message || approveResult.errorMessage);
    return false;
  }
  const { TransactionId } = approveResult.result || approveResult;
  console.log(TransactionId, '===TransactionId');

  await MessageTxToExplore(TransactionId);
  return true;
};

export function getBlockHeight() {
  return getAElf().chain.getBlockHeight();
}

export async function getTxResult(TransactionId: string, reGetCount = 0): Promise<any> {
  const txResult = await ChainConstants.aelfInstance.chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }
  if (!txResult.result) {
    throw Error('Can not get transaction result.');
  }

  if (txResult.result.Status.toLowerCase() === 'pending') {
    if (reGetCount > 10) {
      return TransactionId;
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, reGetCount);
  }

  if (txResult.result.Status.toLowerCase() === 'mined') {
    return TransactionId;
  }

  throw Error(txResult.result.Error || 'Transaction error');
}
function messageHTML(txId: string, type: 'success' | 'error' | 'warning' = 'success', moreMessage = '') {
  const explorerHref = getExploreLink(txId, 'transaction');
  const txIdHTML = (
    <div>
      <div>Transaction Id: {shortenString(txId || '', 8)}</div>
      {moreMessage && <div>{moreMessage.replace('AElf.Sdk.CSharp.AssertionException:', '')}</div>}
      <a target="_blank" href={explorerHref} rel="noreferrer">
        {i18n.t('Turn to aelf explorer to get the information of this transaction')}
      </a>
    </div>
  );
  message[type](txIdHTML, 10);
}

export async function MessageTxToExplore(txId: string, type: 'success' | 'error' | 'warning' = 'success') {
  try {
    const validTxId = await getTxResult(txId);
    messageHTML(validTxId, type);
  } catch (e: any) {
    if (e.TransactionId) {
      messageHTML(txId, 'error', e.Error || 'Transaction error.');
    } else {
      messageHTML(txId, 'error', e.message || 'Transaction error.');
    }
  }
}
export const checkElfAllowanceAndApprove = async (
  tokenContract: ContractBasic,
  symbol: string,
  address: string,
  contractAddress: string,
  amount: string | number,
): Promise<
  | boolean
  | {
      error: Error;
    }
> => {
  const allowance = await tokenContract.callViewMethod('GetAllowance', [symbol, address, contractAddress]);
  if (allowance?.error) {
    message.error(allowance.error.message || allowance.errorMessage?.message || allowance.errorMessage);
    return false;
  }
  const bigA = timesDecimals(amount, 8);
  const allowanceBN = new BigNumber(allowance?.allowance);
  if (allowanceBN.lt(bigA)) {
    return await approveELF(contractAddress, tokenContract, symbol);
  }
  return true;
};

export async function initContracts(contracts: { [name: string]: string }, aelfInstance: any, account?: string) {
  const contractList = Object.entries(contracts);
  try {
    const list = await Promise.all(
      contractList.map(([, address]) => {
        return aelfInstance.chain.contractAt(address, account ? { address: account } : getWallet());
      }),
    );
    const obj: any = {};
    contractList.forEach(([, contract], index) => {
      obj[contract] = list[index];
    });
    console.log(obj, '===obj');
    return obj;
  } catch (error) {
    console.log(error, 'initContracts');
  }
}
function setContractsFileDescriptorBase64(contracts: any) {
  localStorage.setItem(storages.contractsFileDescriptorBase64, JSON.stringify(contracts));
}
function fileDescriptorSetFormatter(result: any) {
  const buffer = Buffer.from(result, 'base64');
  return descriptor.FileDescriptorSet.decode(buffer);
}
export async function getContractFileDescriptorSet(address: string): Promise<any> {
  let base64s: any = localStorage.getItem(storages.contractsFileDescriptorBase64);
  base64s = JSON.parse(base64s);
  if (base64s && base64s[address]) {
    try {
      return fileDescriptorSetFormatter(base64s[address]);
    } catch (error) {
      delete base64s[address];
      setContractsFileDescriptorBase64(base64s);
      return getContractFileDescriptorSet(address);
    }
  } else {
    try {
      if (!base64s) base64s = {};
      const base64 = await baseRequest({
        url: `${ChainConstants.constants.CHAIN_INFO.rpcUrl}/api/blockChain/contractFileDescriptorSet`,
        params: { address },
      });
      const fds = fileDescriptorSetFormatter(base64);
      base64s[address] = base64;
      setContractsFileDescriptorBase64(base64s);
      return fds;
    } catch (error) {
      console.debug(error, '======getContractFileDescriptorSet');
    }
  }
}

export const getServicesFromFileDescriptors = (descriptors: any) => {
  const root = AElf.pbjs.Root.fromDescriptor(descriptors, 'proto3').resolveAll();
  return descriptors.file
    .filter((f: any) => f.service.length > 0)
    .map((f: any) => {
      const sn = f.service[0].name;
      const fullName = f.package ? `${f.package}.${sn}` : sn;
      return root.lookupService(fullName);
    });
};
const isWrappedBytes = (resolvedType: any, name: string) => {
  if (!resolvedType.name || resolvedType.name !== name) {
    return false;
  }
  if (!resolvedType.fieldsArray || resolvedType.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType.fieldsArray[0].type === 'bytes';
};
const isAddress = (resolvedType: any) => isWrappedBytes(resolvedType, 'Address');

const isHash = (resolvedType: any) => isWrappedBytes(resolvedType, 'Hash');
export function transformArrayToMap(inputType: any, origin: any[]) {
  const { fieldsArray } = inputType || {};
  const fieldsLength = (fieldsArray || []).length;
  if (fieldsLength === 0 || (fieldsLength === 1 && !fieldsArray[0].resolvedType)) return origin;

  if (isAddress(inputType) || isHash(inputType)) return origin;
  let result = origin;
  Array.isArray(fieldsArray) &&
    Array.isArray(origin) &&
    fieldsArray.forEach((i, k) => {
      result = {
        ...result,
        [i.name]: origin[k],
      };
    });
  return result;
}

export async function getContractMethods(address: string) {
  const fds = await getContractFileDescriptorSet(address);
  const services = getServicesFromFileDescriptors(fds);
  const obj: any = {};
  Object.keys(services).forEach((key) => {
    const service = services[key];
    Object.keys(service.methods).forEach((key) => {
      const method = service.methods[key].resolve();
      obj[method.name] = method.resolvedRequestType;
    });
  });
  return obj;
}

export const getSignature = async (aelfInstance: any, account: string, hexToBeSign: string, isMobile: boolean) => {
  if (isMobile) {
    const sign = await aelfInstance.sendMessage('keyPairUtils', {
      method: 'sign',
      arguments: [hexToBeSign],
    });
    if (sign?.error) {
      message.error(sign.errorMessage.message || sign.errorMessage || sign.message);
      return false;
    }
    const signedMsgString = [
      sign.r.toString(16, 64),
      sign.s.toString(16, 64),
      `0${sign.recoveryParam.toString()}`,
    ].join('');

    return signedMsgString;
  } else {
    const sign = await aelfInstance.getSignature({
      address: account,
      hexToBeSign,
    });
    if (sign?.error) {
      message.error(sign.errorMessage.message || sign.errorMessage || sign.message);
      return false;
    } else {
      return sign?.signature;
    }
  }
};
