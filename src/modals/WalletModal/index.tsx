import clsx from 'clsx';
import { useModal } from 'contexts/useModal';
import { basicModalView } from 'contexts/useModal/actions';
import { useTranslation } from 'react-i18next';
import CommonModal from '../../components/CommonModal';
import WalletList from './WalletList';
import './styles.less';
export default function WalletModal() {
  const [{ walletModal }, { dispatch }] = useModal();
  const { t } = useTranslation();
  return (
    <CommonModal
      width="auto"
      visible={walletModal}
      title={t('connectWallet')}
      onCancel={() => dispatch(basicModalView.setWalletModal.actions(false))}
      className={clsx('common-modals', 'wallet-modal')}>
      <WalletList />
    </CommonModal>
  );
}
