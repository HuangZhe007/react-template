import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import zh from 'antd/lib/locale/zh_HK';
import './App.less';
import { routes } from 'routes';
import { prefixCls } from 'constants/theme';
function App() {
  return (
    <ConfigProvider locale={zh} prefixCls={prefixCls}>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            return <Route key={route.path} path={route.path} element={<route.element />} />;
          })}
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
