import { Button } from 'antd';
import { useAElfContract } from 'contexts/useAElfContract/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useEffect } from 'react';
const html = window.document.getElementsByTagName('html')[0];
export default function Example() {
  const { account, chainId } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  const tokenContract = useAElfContract('JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE');
  const balance = async () => {
    if (!tokenContract || !account) return;
    const req = await tokenContract?.callViewMethod('GetBalance', {
      symbol: 'ELF',
      owner: account,
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
          if (!html.getAttribute('data-theme') || html.getAttribute('data-theme') === 'light') {
            html.setAttribute('data-theme', 'dark');
          } else {
            html.setAttribute('data-theme', 'light');
          }
        }}>
        color
      </Button>
      {chainId}
      <div className="test-class" />
    </div>
  );
}
