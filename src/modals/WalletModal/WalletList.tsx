import { SUPPORTED_WALLETS } from '../../constants';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { Button, message } from 'antd';
import { useCallback, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import clsx from 'clsx';
import { useActiveWeb3React } from 'hooks/web3';
import { useAElfDispatch } from 'contexts/useAElf/hooks';
export default function WalletList() {
  const { activate } = useWeb3React();
  const { chainId, connector } = useActiveWeb3React();
  const { connect } = useAElfDispatch();
  const [loading, setLoading] = useState<any>();
  const dispatch = useModalDispatch();

  const onCancel = useCallback(() => {
    setLoading(undefined);
    dispatch(basicModalView.setWalletModal.actions(false));
  }, [dispatch]);
  const tryActivation = useCallback(
    async (connector: AbstractConnector | string | undefined, key: string) => {
      if (loading) return;
      setLoading({ [key]: true });
      if (typeof connector === 'string')
        return connect()
          .then(() => {
            onCancel();
          })
          .finally(() => {
            setLoading(undefined);
          });

      if (connector instanceof WalletConnectConnector) connector.walletConnectProvider = undefined;
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
    [activate, connect, loading, onCancel],
  );
  return (
    <>
      {Object.keys(SUPPORTED_WALLETS)
        .filter((key) => {
          const option = SUPPORTED_WALLETS[key];
          return typeof chainId === 'string'
            ? typeof option.connector === 'string'
            : typeof option.connector !== 'string';
        })
        .map((key) => {
          const option = SUPPORTED_WALLETS[key];
          const disabled = !!(option.connector && option.connector === connector);
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
