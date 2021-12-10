import { message } from 'antd';
import { getELFScanLink, shortenString, sleep } from 'utils';
import { getAElf } from './aelf';
import BigNumber from 'bignumber.js';
import i18n from 'i18n';
import { aelfConstants } from 'constants/aelfConstants';
const Aelf = getAElf();
const { CONTRACTS } = aelfConstants;
export const approveELF = async (address = CONTRACTS['tokenContract'], tokenContract: any) => {
  const approveResult = await tokenContract.Approve({
    symbol: 'ELF',
    spender: address,
    amount: '10000000000000000000000000',
  });

  if (approveResult.error) {
    message.error(approveResult.errorMessage.message || approveResult.errorMessage);
    return false;
  }
  const { TransactionId } = approveResult.result || approveResult;
  await MessageTxToExplore(TransactionId);
  return true;
};
async function getTxResult(TransactionId: string, reGetCount = 0): Promise<any> {
  const txResult = await Aelf.chain.getTxResult(TransactionId);

  if (!txResult) {
    throw Error('Can not get transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    if (reGetCount > 10) {
      return TransactionId;
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, reGetCount);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return TransactionId;
  }

  throw Error(txResult.Error || 'Transaction error');
}
function messageHTML(txId: string, type: 'success' | 'error' | 'warning' = 'success', moreMessage = '') {
  const explorerHref = getELFScanLink(txId, 'transaction');
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
  tokenContract: any,
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
  const allowance = await tokenContract.GetAllowance.call({
    symbol,
    spender: contractAddress,
    owner: address,
  });
  if (allowance?.error) {
    message.error(allowance.errorMessage.message || allowance.errorMessage);
    return false;
  }
  const allowanceBN = new BigNumber(allowance?.allowance);
  if (allowanceBN.lt(amount)) {
    const req = await approveELF(contractAddress, tokenContract);
    return req;
  }
  return true;
};
export function getInputTip(stakingAmount: BigNumber, input?: string) {
  let text;
  if (stakingAmount.gte(20100)) {
    text = i18n.t("Can't get more raffle tickets");
  } else {
    if (input) {
      let num;
      let bigInput = new BigNumber(input);
      if (stakingAmount.lt(100)) {
        const diff = stakingAmount.minus(100).abs();
        bigInput = bigInput.minus(diff);
        if (bigInput.eq(0)) {
          num = '1';
        } else {
          bigInput = bigInput.div(1000).integerValue().plus(1);
          num = bigInput.gt(21) ? '21' : bigInput.toFixed();
        }
      } else {
        const total = new BigNumber(20100).minus(stakingAmount);
        const max = total.div(1000).dp(0, BigNumber.ROUND_UP).integerValue();
        let diff = stakingAmount.div(1000);
        diff = diff.minus(diff.integerValue()).times(1000);
        diff = diff.minus(1100).abs();
        bigInput = bigInput
          .minus(diff)
          .div(1000)
          .integerValue()
          .plus(diff.div(1000).gt(1) ? 2 : 1);
        num = bigInput.gt(max) ? max.toFixed() : bigInput.toFixed();
      }
      return i18n.t('Can get more raffle tickets', { num });
    } else {
      let amount = stakingAmount;
      if (stakingAmount.lt(100)) {
        amount = stakingAmount.minus(100).abs();
      } else {
        amount = stakingAmount.minus(100).div(1000);
        amount = amount.minus(amount.integerValue()).times(1000).minus(1000).abs();
      }
      text = i18n.t('ELF are needed to get the next raffle ticket', {
        num: amount.toFixed(),
      });
    }
  }
  return text;
}

export async function initContracts(contracts: { [name: string]: string }, aelfInstance: any, account: string) {
  await aelfInstance.chain.getChainStatus();
  const contractList = Object.entries(contracts);
  const list = await Promise.all(
    contractList.map(([, address]) => {
      return aelfInstance.chain.contractAt(address, { address: account });
    }),
  );
  const obj: any = {};
  contractList.forEach(([name], index) => {
    obj[name] = list[index];
  });
  return obj;
}
