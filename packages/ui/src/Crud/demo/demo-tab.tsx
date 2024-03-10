import { ArrowLeftOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useLocation } from 'dumi';
import DynamicSettings from './tablePlayground';

export default function Demo() {
  const fullCrudLink = '/~demos/packages-ui-src-crud-index-tab-builder-demo-demo-tab';
  const { pathname } = useLocation() || {};
  const isFullDemoMode = (pathname as string).includes('~demos/');
  console.log(isFullDemoMode);

  return (
    <div className="p-0">
      <Button
        size="large"
        type="link"
        onClick={() => {
          if (isFullDemoMode) return window.open('/uis/crud?tab=builder', '_blank');
          window.open(fullCrudLink, '_blank');
        }}
        shape="circle"
        icon={isFullDemoMode ? <ArrowLeftOutlined /> : <FullscreenOutlined />}
      >
        {isFullDemoMode ? 'Back' : ''}
      </Button>
      <DynamicSettings />
    </div>
  );
}
