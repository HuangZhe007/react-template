import { Button } from 'antd';
const body = window.document.getElementsByTagName('body')[0];
body.className = 'l-color';
export default function Example() {
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          if (body.className === 'l-color') {
            body.className = 'd-color';
          } else {
            body.className = 'l-color';
          }
        }}>
        Button
      </Button>
      <div className="test-class" />
    </div>
  );
}
