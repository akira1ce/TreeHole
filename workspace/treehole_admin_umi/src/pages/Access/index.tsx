import { PageContainer } from '@ant-design/pro-components';
import { Access, connect, useAccess } from '@umijs/max';
import { Button } from 'antd';

const AccessPage: React.FC = (props) => {
  const access = useAccess();

  return (
    <PageContainer ghost>
      <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access>
    </PageContainer>
  );
};

export default connect(({ user }: any) => ({ user }))(AccessPage);
