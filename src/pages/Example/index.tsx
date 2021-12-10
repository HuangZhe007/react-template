import { Button } from 'antd';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
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
    </div>
  );
}
