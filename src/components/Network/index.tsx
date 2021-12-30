import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CHAIN_NAME, networkList } from '../../constants';
import { useMemo } from 'react';
import { switchNetwork } from '../../utils/network';
import { SupportedChainId } from 'constants/chain';
import { useActiveWeb3React } from 'hooks/web3';
export default function Network(props: { overlayClassName?: string | undefined }) {
  const { chainId } = useActiveWeb3React();
  const menu = useMemo(() => {
    return (
      <Menu selectedKeys={chainId ? [chainId.toString()] : undefined}>
        {networkList.map((i) => {
          return (
            <Menu.Item key={i.info.chainId} onClick={() => switchNetwork(i.info)}>
              {i.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }, [chainId]);
  if (!chainId) return null;
  return (
    <Dropdown overlayClassName={props.overlayClassName} overlay={menu} trigger={['click']}>
      <Button>
        {CHAIN_NAME[chainId as SupportedChainId] || 'Wrong Network'}&nbsp;
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
