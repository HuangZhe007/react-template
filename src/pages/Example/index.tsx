import { Button } from 'antd';
import { setThemes } from 'utils/themes';
import './styles.less';
export default function Example() {
  return (
    <div>
      <Button type="primary" onClick={() => setThemes('dark')}>
        dark
      </Button>
      <Button type="primary" onClick={() => setThemes('light')}>
        light
      </Button>
      <div className="dark-box" />
      <div className="light-box" />
    </div>
  );
}
