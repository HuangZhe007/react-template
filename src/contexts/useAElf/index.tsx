import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { NightElf } from 'utils/NightElf';
import { message } from 'antd';
import { ChainConstants } from 'constants/ChainConstants';
import { APP_NAME } from 'constants/aelf';
import { useEffectOnce } from 'react-use';
import { getAElf } from 'utils/aelfUtils';
import { AElfInstance, ChainStatus } from 'types/aelf';
import { formatLoginInfo } from 'contexts/utils';
const INITIAL_STATE = {
  installedNightElf: !!window?.NightElf,
};
const AElfContext = createContext<any>(INITIAL_STATE);

type State = {
  installedNightElf: boolean;
  address?: string;
  name?: string;
  pubKey?: string;
  appPermission?: any;
  aelfInstance?: AElfInstance;
  chainId?: string;
  chainStatus?: ChainStatus;
};
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_AELF = 'SET_AELF';

type Actions = {
  connect: () => Promise<boolean>;
  disConnect: () => void;
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
        pubKey: null,
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

  const connect = useCallback(async () => {
    const aelfInstance = getAElf();
    return new Promise((resolve, reject) => {
      NightElf.getInstance()
        .check.then(() => {
          const aelf = NightElf.initAelfInstanceByExtension(ChainConstants.constants.CHAIN_INFO.rpcUrl, APP_NAME);
          aelf
            .login(ChainConstants.constants.LOGIN_INFO)
            .then(async (result: { error: any; errorMessage: { message: any }; detail: string }) => {
              if (result.error) {
                message.warning(result.errorMessage.message || result.errorMessage);
                reject(false);
              } else {
                const chainStatus = await aelf.chain.getChainStatus();
                const detail = formatLoginInfo(result.detail);
                dispatch({
                  type: LOGIN,
                  payload: {
                    ...detail,
                    aelfInstance: aelf,
                    chainStatus: chainStatus && !chainStatus.error ? chainStatus : undefined,
                  },
                });
                resolve(true);
              }
            })
            .catch((error: { message: any }) => {
              dispatch({
                type: SET_AELF,
                payload: { aelfInstance },
              });
              reject(false);
              message.error(error.message || 'AELF Explorer extension error');
            });
        })
        .catch((error: { message: any }) => {
          dispatch({
            type: SET_AELF,
            payload: { aelfInstance },
          });
          reject(false);
          message.error(`AELF Explorer extension load failed: ${error.message}`);
          console.log('error: ', error);
        });
    });
  }, []);
  const disConnect = useCallback(async () => {
    if (!state.address || !state.aelfInstance) {
      message.error('Please login');
      return;
    }
    state.aelfInstance.logout(
      {
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
    const login = await aelfInstance.login(ChainConstants.constants.LOGIN_INFO);
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
    ChainConstants.chainType === 'AELF' && connect();
  });
  return (
    <AElfContext.Provider
      value={useMemo(
        () => [
          { ...state },
          {
            connect,
            disConnect,
            checkLogin,
          },
        ],
        [state, connect, disConnect, checkLogin],
      )}>
      {children}
    </AElfContext.Provider>
  );
}
