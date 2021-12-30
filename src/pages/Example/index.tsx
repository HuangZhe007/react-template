import { Button } from 'antd';
import Network from 'components/Network';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { setThemes } from 'utils/themes';
import './styles.less';
export default function Example() {
  const { account } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          !account
            ? modalDispatch(basicModalView.setWalletModal.actions(true))
            : modalDispatch(basicModalView.setAccountModal.actions(true));
        }}>
        {account ? 'Wallet' : 'Connect'}
      </Button>
      <Button type="primary" onClick={() => setThemes('dark')}>
        dark
      </Button>
      <Button type="primary" onClick={() => setThemes('light')}>
        light
      </Button>
      <Network />
      <div className="dark-box" />
      <div className="light-box" />
    </div>
  );
}
