import { Button } from 'antd';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
const body = window.document.getElementsByTagName('body')[0];
body.className = 'l-color';
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
      <Button
        type="primary"
        onClick={() => {
          if (body.className === 'l-color') {
            body.className = 'd-color';
          } else {
            body.className = 'l-color';
          }
        }}>
        color
      </Button>
      <div className="test-class" />
    </div>
  );
}
