import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { useAElf } from 'contexts/useAElf';
import { sleep } from 'utils';
import { initContracts } from 'utils/aelfutils';
import { aelfConstants } from 'constants/aelfConstants';
import { ContractContextState } from './types';
const { CONTRACTS } = aelfConstants;

const DESTROY = 'DESTROY';
const SET_CONTRACT = 'SET_CONTRACT';

const INITIAL_STATE = {};
const ContractContext = createContext<any>(INITIAL_STATE);

export function useAElfContractContext(): ContractContextState {
  return useContext(ContractContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [{ aelfInstance, address }] = useAElf();
  const init = useCallback(async () => {
    if (!address) return dispatch({ type: DESTROY });
    if (aelfInstance?.chain && address) {
      try {
        // Need to initialize the contract at the same time
        // getChainStatus will clear the contracts of NightElf
        const contracts = await initContracts(CONTRACTS, aelfInstance, address);
        dispatch({
          type: SET_CONTRACT,
          payload: contracts,
        });
      } catch (error) {
        console.log(error, 'init Contract');
        // Initialize again at one second interval after initialization failure
        await sleep(1000);
        init();
      }
    }
  }, [address, aelfInstance]);
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  return <ContractContext.Provider value={useMemo(() => state, [state])}>{children}</ContractContext.Provider>;
}
