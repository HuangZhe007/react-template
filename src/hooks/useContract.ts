import { ERC20_ABI } from 'constants/abis';
import { useMemo } from 'react';
import { isAddress } from 'utils';
import { ContractBasic } from 'utils/contract';
import { provider } from 'web3-core';
import { useActiveWeb3React } from './web3';

export function getContract(address: string, ABI: any, library: provider) {
  if (!isAddress(address)) {
    // return null
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new ContractBasic({
    contractAddress: address,
    contractABI: ABI,
    provider: library,
  });
}

function useContract(address: string | undefined, ABI: any): ContractBasic | null {
  const { library } = useActiveWeb3React();
  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library);
    } catch (error) {
      return null;
    }
  }, [address, ABI, library]);
}

export function useTokenContract(tokenAddress?: string) {
  return useContract(tokenAddress, ERC20_ABI);
}
