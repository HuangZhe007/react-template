import { ChainType } from 'types';
import { provider } from 'web3-core';
import { ACTIVE_CHAIN, ChainConstantsType, CHAIN_ID_TYPE, DEFAULT_CHAIN, supportedChainId } from '.';

type AElfOwnConstants = {
  CONTRACTS?: { [key: string]: string };
  LOGIN_INFO?: any;
  TOKEN_CONTRACT?: string;
};

type Constants = ChainConstantsType & AElfOwnConstants;

export class ChainConstants {
  public id: number | string;
  static constants: Constants;
  static chainId: number | string;
  static library?: provider;
  static apiChainId?: string;
  static chainType: ChainType;
  static aelfInstance?: any;
  static aelfContracts?: any;
  static account?: string | null;
  constructor(
    id: number | string,
    type: ChainType,
    library?: provider,
    aelfInstance?: any,
    aelfContracts?: any,
    account?: string | null,
  ) {
    this.id = id;
    ChainConstants['library'] = library;
    ChainConstants['aelfInstance'] = aelfInstance;
    ChainConstants['chainType'] = type;
    ChainConstants['aelfContracts'] = aelfContracts;
    ChainConstants['account'] = account;
    this.setStaticAttrs();
  }
  getStaticAttr(attrName: keyof ChainConstantsType) {
    return ChainConstants.constants[attrName];
  }
  setStaticAttrs() {
    const chainId = (this.id || window.ethereum?.chainId) as CHAIN_ID_TYPE;
    let attrs;
    if (ACTIVE_CHAIN[chainId]) {
      attrs = supportedChainId[chainId];
    } else {
      attrs = supportedChainId[DEFAULT_CHAIN];
    }
    ChainConstants['chainId'] = attrs.CHAIN_INFO.chainId;
    ChainConstants['constants'] = attrs;
  }
}
