import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { NetworkContextName } from 'constants/index';
import { useLanguage } from 'i18n';
import Web3ReactManager from 'components/Web3ReactManager';
import { ANTD_LOCAL } from 'i18n/config';
import { ConfigProvider } from 'antd';
import getLibrary from 'utils/getLibrary';
import ModalProvider from './contexts/useModal';
import ChianProvider from 'contexts/useChian';
import StoreProvider from 'contexts/useStore';

import './index.css';
import { prefixCls } from 'constants/theme';
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function ContextProviders({ children }: { children?: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <ConfigProvider locale={ANTD_LOCAL[language]} autoInsertSpaceInButton={false} prefixCls={prefixCls}>
      <ModalProvider>{children}</ModalProvider>
    </ConfigProvider>
  );
}
ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Web3ReactManager>
        <ChianProvider>
          <StoreProvider>
            <ContextProviders>
              <App />
            </ContextProviders>
          </StoreProvider>
        </ChianProvider>
      </Web3ReactManager>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
