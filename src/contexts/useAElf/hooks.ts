import { useMemo } from 'react';
import { useAElf } from '.';

export function useAElfDispatch() {
  const [, { connect, disConnect, checkLogin }] = useAElf();
  return useMemo(
    () => ({
      connect,
      disConnect,
      checkLogin,
    }),
    [checkLogin, connect, disConnect],
  );
}
