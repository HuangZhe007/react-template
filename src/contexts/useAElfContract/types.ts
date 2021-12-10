import { aelfConstants } from 'constants/aelfConstants';

const { CONTRACTS } = aelfConstants;

export type ContractKEYS = keyof typeof CONTRACTS;
export type ContractContextState = {
  [x in ContractKEYS]: any;
};
