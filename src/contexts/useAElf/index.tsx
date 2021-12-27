import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { NightElf } from 'utils/NightElf';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import { aelfConstants } from 'constants/aelfConstants';
const { LOGIN_INFO, CHAIN_ID, HTTP_PROVIDER, APP_NAME } = aelfConstants;
const INITIAL_STATE = {
  installedNightElf: !!window?.NightElf,
};
const AElfContext = createContext<any>(INITIAL_STATE);

type State = {
  installedNightElf: boolean;
  address?: string;
  name?: string;
  publicKey?: {
    x: string;
    y: string;
  };
  appPermission?: any;
  aelfInstance?: any;
  chainId?: string;
};
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

type Actions = {
  Connect: () => void;
  DisConnect: () => void;
  checkLogin: () => Promise<undefined | boolean>;
};

export function useAElf(): [State, Actions] {
  return useContext(AElfContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case LOGOUT: {
      return Object.assign({}, state, {
        address: null,
        name: null,
        publicKey: null,
        appPermission: null,
        aelfInstance: null,
        chainId: null,
      });
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch]: [State, any] = useReducer(reducer, INITIAL_STATE);
  const Connect = useCallback(async () => {
    NightElf.getInstance()
      .check.then(() => {
        const aelf = NightElf.initAelfInstanceByExtension(HTTP_PROVIDER, APP_NAME);
        aelf
          .login(LOGIN_INFO)
          .then((result: { error: any; errorMessage: { message: any }; detail: string }) => {
            if (result.error) {
              message.warning(result.errorMessage.message || result.errorMessage);
            } else {
              const detail = JSON.parse(result.detail);
              dispatch({
                type: LOGIN,
                payload: { ...detail, aelfInstance: aelf, chainId: CHAIN_ID },
              });
            }
          })
          .catch((error: { message: any }) => {
            message.error(error.message || 'AELF Explorer extension error');
          });
      })
      .catch((error: { message: any }) => {
        message.error(`AELF Explorer extension load failed: ${error.message}`);
        console.log('error: ', error);
      });
  }, []);
  const DisConnect = useCallback(async () => {
    if (!state.address || !state.aelfInstance) {
      message.error('Please login');
      return;
    }
    state.aelfInstance.logout(
      {
        chainId: CHAIN_ID,
        address: state.address,
      },
      (error: { errorMessage: { message: any }; message: any }) => {
        if (error) {
          message.error(error.errorMessage.message || error.errorMessage || error.message);
        } else {
          dispatch({
            type: LOGOUT,
          });
        }
      },
    );
  }, [state.address, state.aelfInstance]);
  const checkLogin = useCallback(async () => {
    const { aelfInstance, address } = state || {};
    if (!address || !aelfInstance) return false;
    const login = await aelfInstance.login(LOGIN_INFO);
    if (login?.error) {
      message.error(login.errorMessage.message || login.errorMessage || login.message);
      dispatch({
        type: LOGOUT,
      });
      return false;
    } else {
      const detail = JSON.parse(login.detail);
      dispatch({
        type: LOGIN,
        payload: { ...detail, aelfInstance: aelfInstance },
      });
      return true;
    }
  }, [state]);
  useEffectOnce(() => {
    Connect();
  });
  return (
    <AElfContext.Provider
      value={useMemo(
        () => [
          { ...state },
          {
            Connect,
            DisConnect,
            checkLogin,
          },
        ],
        [state, Connect, DisConnect, checkLogin],
      )}>
      {children}
    </AElfContext.Provider>
  );
}
