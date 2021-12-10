import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Button, Card, Col, Row } from 'antd';
import { useCallback, useMemo } from 'react';
import { injected, walletlink } from '../../walletConnectors';
import { SUPPORTED_WALLETS } from '../../constants';
import { getEtherscanLink, shortenAddress } from '../../utils';
import Copy from 'components/Copy';
import CommonLink from '../../components/CommonLink';
import CommonModal from 'components/CommonModal';
import { useModal } from 'contexts/useModal';
import { basicModalView } from 'contexts/useModal/actions';
function AccountModal() {
  const [{ accountModal }, { dispatch }] = useModal();
  const { account, connector, error, chainId, deactivate } = useWeb3React();
  const formatConnectorName = useMemo(() => {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return `Connected with ${name}`;
  }, [connector]);
  const connectorIcon = useMemo(() => {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const icon = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map((k) => SUPPORTED_WALLETS[k].icon)[0];
    return <img style={{ width: '18px', height: '18px' }} src={icon} alt="" />;
  }, [connector]);
  const onDisconnect = useCallback(() => {
    if (connector !== injected && connector !== walletlink) {
      (connector as any).close();
    } else {
      deactivate();
    }
    dispatch(basicModalView.setWalletModal.actions(true));
  }, [connector, deactivate, dispatch]);
  return (
    <CommonModal
      visible={accountModal}
      title="Account"
      width="auto"
      className={'account-modal'}
      onCancel={() => dispatch(basicModalView.setAccountModal.actions(false))}>
      <p>{formatConnectorName}</p>
      <Card className="account-modal-card">
        <Row justify="space-between">
          {account ? (
            <span className="account-modal-account">
              {connectorIcon} {shortenAddress(account)}
            </span>
          ) : null}
          {error ? (
            <span className="account-modal-account">
              {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}
            </span>
          ) : null}
          {account ? (
            <Copy className="account-modal-copy" toCopy={account}>
              Copy Address
            </Copy>
          ) : null}
        </Row>
        {chainId && account ? (
          <CommonLink href={getEtherscanLink(account, 'address')}>View on Etherscan</CommonLink>
        ) : null}
      </Card>
      <Col span={24}>
        <Row justify="space-between" className="account-modal-button">
          <Button type="primary" onClick={onDisconnect}>
            Disconnect
          </Button>
          <Button type="primary" onClick={() => dispatch(basicModalView.setWalletModal.actions(true))}>
            Change
          </Button>
        </Row>
      </Col>
    </CommonModal>
  );
}

export default AccountModal;
