import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import storages from 'storages';
import { eventBus } from 'utils';

const INITIAL_STATE = {};
const ChainContext = createContext<any>(INITIAL_STATE);

declare type ChainState = {
  userChainId?: number;
};
export function useChain(): [ChainState] {
  return useContext(ChainContext);
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [userChainId, setUserChainId] = useLocalStorage(storages.userChainId);
  useEffect(() => {
    eventBus.addListener(storages.userChainId, setUserChainId);
    return () => {
      eventBus.removeListener(storages.userChainId, setUserChainId);
    };
  }, [setUserChainId]);
  return (
    <ChainContext.Provider value={useMemo(() => [{ userChainId }], [userChainId])}>{children}</ChainContext.Provider>
  );
}
