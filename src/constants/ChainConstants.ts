import { provider } from 'web3-core';
import { ACTIVE_CHAIN, ChainConstantsType, CHAIN_ID_TYPE, DEFAULT_CHAIN, supportedChainId } from '.';

export class ChainConstants {
  public id: number;
  public library?: provider;
  static constants: ChainConstantsType;
  static chainId: number;
  static library?: provider;
  static apiChainId?: string;
  constructor(id: number, library?: provider) {
    this.id = id;
    this.library = library;
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
    ChainConstants['library'] = this.library;
  }
}
