import { useMemo } from 'react';
import { AElfContractBasic } from 'utils/contract';
import { useAElfContractContext } from '.';
import { ContractKEYS } from './types';

export function useAElfContract(contractName: ContractKEYS) {
  const contracts = useAElfContractContext();
  const contract = contracts[contractName];
  return useMemo(() => {
    if (!contract) return;
    return new AElfContractBasic({ contract });
  }, [contract]);
}
