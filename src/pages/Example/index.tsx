import { Button } from 'antd';
import { useAElf } from 'contexts/useAElf';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
const body = window.document.getElementsByTagName('body')[0];
body.className = 'l-color';
export default function Example() {
  const { account } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  const [{ address, chainId }, { Connect, DisConnect }] = useAElf();
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          !account
            ? modalDispatch(basicModalView.setWalletModal.actions(true))
            : modalDispatch(basicModalView.setAccountModal.actions(true));
        }}>
        {account ? account : 'Connect'}
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
      <Button
        type="primary"
        onClick={() => {
          !address ? Connect() : DisConnect();
        }}>
        {address ? address : 'Connect aelf'}
      </Button>
      {chainId}
      <div className="test-class" />
    </div>
  );
}
