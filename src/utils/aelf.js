import AElf from 'aelf-sdk';
import { aelfConstants } from 'constants/aelfConstants';
const { COMMON_PRIVATE, HTTP_PROVIDER } = aelfConstants;
let wallet, aelf;

export function getAElf() {
  if (aelf) return aelf;
  aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
  return aelf;
}

export function getWallet() {
  const Wallet = AElf.wallet;
  if (wallet) return wallet;
  wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  return wallet;
}
