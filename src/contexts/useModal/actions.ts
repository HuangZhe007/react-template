import { basicActions } from 'contexts/utils';

const modalActions = {
  setWalletModal: 'SET_WALLET_MODAL',
  setAccountModal: 'SET_ACCOUNT_MODAL',
  setNetWorkDrawer: 'SET_NETWORK_DRAWER',
  destroy: 'DESTROY',
};

export type modalState = {
  walletModal: boolean;
  netWorkDrawer: boolean;
  accountModal: boolean;
};

export const basicModalView = {
  setWalletModal: {
    type: modalActions['setWalletModal'],
    actions: (walletModal: boolean) =>
      basicActions(modalActions['setWalletModal'], {
        walletModal,
        destroy: true,
      }),
  },
  setAccountModal: {
    type: modalActions['setAccountModal'],
    actions: (accountModal: boolean) =>
      basicActions(modalActions['setAccountModal'], {
        accountModal,
        destroy: true,
      }),
  },
  setNetWorkDrawer: {
    type: modalActions['setNetWorkDrawer'],
    actions: (netWorkDrawer: boolean) => basicActions(modalActions['setNetWorkDrawer'], { netWorkDrawer }),
  },
  destroy: {
    type: modalActions['destroy'],
    actions: () => basicActions(modalActions['destroy']),
  },
};
