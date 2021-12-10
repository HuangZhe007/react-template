import { SUPPORTED_WALLETS } from '../../constants';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { Button, message } from 'antd';
import { useCallback, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import clsx from 'clsx';
export default function WalletList() {
  const { connector, activate } = useWeb3React();
  const [loading, setLoading] = useState<any>();
  const dispatch = useModalDispatch();

  const onCancel = useCallback(() => {
    setLoading(undefined);
    dispatch(basicModalView.setWalletModal.actions(false));
  }, [dispatch]);
  const tryActivation = useCallback(
    async (connector: AbstractConnector | undefined, key: string) => {
      if (loading) return;
      setLoading({ [key]: true });
      if (connector instanceof WalletConnectConnector) {
        connector.walletConnectProvider = undefined;
      }
      console.log(connector, '=====connector');

      connector &&
        activate(connector, undefined, true)
          .then(() => {
            onCancel();
          })
          .catch((error) => {
            if (error instanceof UnsupportedChainIdError) {
              activate(connector);
              onCancel();
            } else {
              message.error(error.message);
              setLoading(undefined);
            }
          });
    },
    [activate, loading, onCancel],
  );
  return (
    <>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        const disabled = option.connector && option.connector === connector;
        return (
          <Button
            className={clsx(disabled && 'selected')}
            disabled={disabled}
            loading={loading?.[option.name]}
            key={option.name}
            onClick={() => {
              option.connector !== connector && tryActivation(option.connector, option.name);
            }}>
            <div>{option.name}</div>
            <img style={{ width: '22px', height: '22px' }} src={option.icon} alt="" />
          </Button>
        );
      })}
    </>
  );
}
