import { Button } from 'antd';
import Network from 'components/Network';
import { ChainConstants } from 'constants/ChainConstants';
import { useAElfContract } from 'contexts/useAElfContract/hooks';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useLockCallback } from 'hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useEffect, useState } from 'react';
import { setThemes } from 'utils/themes';
import './styles.less';
function mockApiRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
export default function Example() {
  const { account, chainId } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();
  const tokenContract = useAElfContract(ChainConstants.constants?.tokenContract || '');
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
  const [url, setUrl] = useState({});
  console.log(url, '====url');
  const submit = useLockCallback(async () => {
    console.log('submit strat');
    await mockApiRequest();
    console.log('submit end', url);
  }, [url]);

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
      <Network />
      <div className="dark-box" />
      <div className="light-box" />
      {chainId}
      <div className="test-class" />
      <Button type="primary" onClick={() => setUrl((v) => ({ ...v, a: 1 }))}>
        a
      </Button>
      <Button type="primary" onClick={() => setUrl((v) => ({ ...v, b: 1 }))}>
        b
      </Button>
      <Button type="primary" onClick={() => submit()}>
        submit
      </Button>
    </div>
  );
}
