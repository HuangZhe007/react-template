import { Button } from 'antd';
import { useAElf } from 'contexts/useAElf';
import { useAElfContract } from 'contexts/useAElfContract/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useEffect } from 'react';
const body = window.document.getElementsByTagName('body')[0];
body.className = 'l-color';
export default function Example() {
  const { account } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  const [{ address, chainId }, { Connect, DisConnect }] = useAElf();
  const aelfTokenContract = useAElfContract('tokenContract');
  const balance = async () => {
    if (!aelfTokenContract) return;
    const req = await aelfTokenContract?.callViewMethod('GetBalance', {
      symbol: 'ELF',
      owner: address,
    });
    console.log(req, '=====req');
  };
  useEffect(() => {
    balance();
  });
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
