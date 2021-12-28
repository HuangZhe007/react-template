import { useMemo } from 'react';
import { ContractBasic } from 'utils/contract';
import { useAElfContractContext } from '.';
import { ContractKEYS } from './types';

export function useAElfContract(contractAddress: ContractKEYS) {
  const contracts = useAElfContractContext();
  const contract = contracts?.[contractAddress];

  return useMemo(() => {
    if (!contract) return;
    return new ContractBasic({ aelfContract: contract, contractAddress });
  }, [contract, contractAddress]);
}
