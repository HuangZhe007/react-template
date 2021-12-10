import { useMemo } from 'react';
import { useStore } from '.';

export function useMobile() {
  const [{ mobile }] = useStore();
  return useMemo(() => !!mobile, [mobile]);
}
