import { Button } from 'antd';
import { useAElfContract } from 'contexts/useAElfContract/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useEffect } from 'react';
import { setThemes } from 'utils/themes';
import './styles.less';
export default function Example() {
  const { account, chainId } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  const tokenContract = useAElfContract('JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE');
  const balance = async () => {
    if (!tokenContract) return;
    const req = await tokenContract?.callViewMethod('GetBalance', {
      symbol: 'ELF',
      owner: '3DHPLvZudScbRTTEkYBeSYGYx7kHh6udEgwR7DfH2dwFK9kBa',
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
      <Button type="primary" onClick={() => setThemes('dark')}>
        dark
      </Button>
      <Button type="primary" onClick={() => setThemes('light')}>
        light
      </Button>
      <div className="dark-box" />
      <div className="light-box" />
      {chainId}
      <div className="test-class" />
    </div>
  );
}
