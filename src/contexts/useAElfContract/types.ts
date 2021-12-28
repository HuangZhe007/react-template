export type ContractKEYS = string;
export type ContractContextState = {
  [x in ContractKEYS]: any;
};
