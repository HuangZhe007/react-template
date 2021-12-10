import { useMemo } from 'react';
import { useAElfContractContext } from '.';
import { ContractKEYS } from './types';

export function useAElfContract(contractName: ContractKEYS) {
  const contracts = useAElfContractContext();
  const contract = contracts[contractName];

  return useMemo(() => contract, [contract]);
}
