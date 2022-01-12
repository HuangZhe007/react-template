import { DependencyList, Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import isDeepEqual from 'react-use/lib/misc/isDeepEqual';

/**
 * useUnmounted
 * @returns boolean
 * whether the component is unmounted
 */
export function useUnmounted() {
  const unmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef.current;
}
/**
 * @method useAsyncState
 * Prevent React state update on an unmounted component.
 */
export function useAsyncState<S>(initialState?: S | (() => S)): [S | undefined, Dispatch<SetStateAction<S>>] {
  const unmountedRef = useUnmounted();
  const [state, setState] = useState(initialState);
  const setAsyncState = useCallback((s) => {
    if (unmountedRef) return;
    setState(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [state, setAsyncState];
}

export function useDeepEQMemo<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  // Trigger the factory for the first time or when the object that depends on the change changes
  if (current.initialized === false || !isDeepEqual(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}

export function useCreation<T>(factory: () => T, deps: any[]) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  // Trigger the factory for the first time or when the object that depends on the change changes
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}

function depsAreSame(oldDeps: any[], deps: any[]): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (oldDeps[i] !== deps[i]) return false;
  }
  return true;
}
// Add lock to an async function to prevent parallel executions.
export function useLockCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList) {
  const lock = useRef(false);
  return useCallback(async (...args) => {
    if (lock.current) return;
    lock.current = true;
    try {
      const req = await callback(...args);
      lock.current = false;
      return req;
    } catch (e) {
      lock.current = false;
      throw e;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
