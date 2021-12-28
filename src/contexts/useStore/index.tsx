import { SupportedChainId } from 'constants/chain';
import { ChainConstants } from 'constants/ChainConstants';
import { supportedChainId } from 'constants/index';
import { useActiveWeb3React } from 'hooks/web3';
import { createContext, useContext, useMemo, useReducer, useState } from 'react';
import { useEffectOnce, useSearchParam } from 'react-use';
import isMobile from 'utils/isMobile';
import { switchNetwork } from 'utils/network';
import { provider } from 'web3-core';
const INITIAL_STATE = {};
const StoreContext = createContext<any>(INITIAL_STATE);

declare type StoreState = { mobile?: boolean };
export function useStore(): [StoreState] {
  return useContext(StoreContext);
}

//reducer payload
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    default:
      return Object.assign({}, state, payload);
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { chainId, library, aelfInstance } = useActiveWeb3React();
  const [mobile, setMobile] = useState<boolean>();
  useMemo(() => initialized(chainId, library, aelfInstance), [chainId, library, aelfInstance]);

  const toChainId = useSearchParam('toChainId');
  useEffectOnce(() => {
    if (toChainId && supportedChainId[Number(toChainId) as SupportedChainId])
      switchNetwork(supportedChainId[Number(toChainId) as SupportedChainId].CHAIN_INFO);
  });

  // isMobile
  useEffectOnce(() => {
    const resize = () => {
      const isM = isMobile();
      setMobile(isM.apple.phone || isM.android.phone || isM.apple.tablet || isM.android.tablet);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  return (
    <StoreContext.Provider value={useMemo(() => [{ ...state, mobile }, { dispatch }], [state, mobile])}>
      {children}
    </StoreContext.Provider>
  );
}
function initialized(chainId?: number | string, library?: provider, aelfInstance?: any) {
  if (chainId) {
    if (typeof chainId === 'string') {
      new ChainConstants(chainId, 'AELF', library, aelfInstance);
    } else {
      new ChainConstants(chainId, 'ERC', library, aelfInstance);
    }
  }
}
