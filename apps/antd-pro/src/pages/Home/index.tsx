import Counter from '@/components/Counter';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Counter />
        {name}
      </div>
    </PageContainer>
  );
};

export default HomePage;
