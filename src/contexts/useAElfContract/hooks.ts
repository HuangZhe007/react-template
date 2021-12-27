import { useMemo } from 'react';
import { ContractBasic } from 'utils/contract';
import { useAElfContractContext } from '.';
import { ContractKEYS } from './types';

export function useAElfContract(contractName: ContractKEYS) {
  const contracts = useAElfContractContext();
  const contract = contracts[contractName];
  return useMemo(() => {
    if (!contract) return;
    return new ContractBasic({ aelfContract: contract, contractAddress: '1' });
  }, [contract]);
}
