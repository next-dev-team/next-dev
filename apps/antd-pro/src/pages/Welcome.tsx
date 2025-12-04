import { PageContainer } from '@ant-design/pro-components';
import { getApiPosts } from '@rnr/api-spec/src/gen/client';
import { useQuery } from '@tanstack/react-query';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import type React from 'react';
import { getAuthHeaders } from '@/utils/auth';

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const postsQuery: any = useQuery({
    queryKey: ['posts', 'welcome'],
    queryFn: () => getApiPosts(undefined, { headers: getAuthHeaders() }),
  });
  const posts = (postsQuery.data as any)?.data ?? [];
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: token.colorTextHeading,
            }}
          >
            Posts
          </div>
          <div>
            {postsQuery.isLoading && <span>Loading...</span>}
            {postsQuery.isError && <span>Error</span>}
            {!postsQuery.isLoading && !postsQuery.isError && (
              <ul>
                {posts.map((p: any) => (
                  <li key={p.id}>{p.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
