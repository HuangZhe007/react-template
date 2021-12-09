import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import zh from 'antd/lib/locale/zh_HK';
import './App.less';
function App() {
  const [colorClass, setColorClass] = useState('l-color');
  return (
    <div className={colorClass}>
      <ConfigProvider locale={zh} prefixCls="demo">
        <Button
          type="primary"
          onClick={() => {
            setColorClass(colorClass === 'l-color' ? 'd-color' : 'l-color');
          }}>
          Button
        </Button>
        <div className="test-class" />
      </ConfigProvider>
    </div>
  );
}

export default App;
