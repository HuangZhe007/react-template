import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { NightElfCheck } from 'utils/NightElf/NightElf';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import { getWallet } from 'utils/aelf';
import { aelfConstants } from 'constants/aelfConstants';
const { LOGIN_INFO, CHAIN_ID } = aelfConstants;
const INITIAL_STATE = {};
const AElfContext = createContext<any>(INITIAL_STATE);

type State = {
  installedNightElf: boolean;
  wallet?: any;
  address?: string;
  name?: string;
  publicKey?: any;
  appPermission?: any;
  aelfInstance?: any;
  chainId?: string;
};
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_AELF = 'SET_AELF';

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
    NightElfCheck.getInstance()
      .check.then(() => {
        const aelf = NightElfCheck.initAelfInstanceByExtension();
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
  const initAElf = useCallback(async () => {
    const wallet = getWallet();
    dispatch({
      type: SET_AELF,
      payload: {
        wallet,
        installedNightElf: !!window?.NightElf,
      },
    });
  }, []);
  const checkLogin = useCallback(async () => {
    if (state.address) {
      const aelf = NightElfCheck.initAelfInstanceByExtension();
      const login = await aelf.login(LOGIN_INFO);
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
          payload: { ...detail, aelfInstance: aelf },
        });
        return true;
      }
    }
  }, [state.address]);
  useEffectOnce(() => {
    Connect();
    initAElf();
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
