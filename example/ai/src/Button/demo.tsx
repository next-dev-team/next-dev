import { ProChat } from '@ant-design/pro-chat';
import { useLockFn } from '@next-dev/hooks';
import { theme } from '@next-dev/ui';
import { useState } from 'react';

const API_URL = '/backend-api/v2/conversation';

export default function Demo() {
  const { token } = theme.useToken();
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useLockFn(async (messages: any[] = []) => {
    const nextMsg = messages.map((item) => {
      return {
        role: item?.role,
        content: item?.content || '',
      };
    });
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: new Date().getTime(),
          // model: '',
          web_search: false,
          // provider: 'BingCreateImages',
          messages: [{ role: 'user', content: 'cat' }],
          auto_continue: true,
          api_key: '',

          // id: new Date().getTime(),
          // // stream: false,
          // conversation_id: '04f689d7-86fd-4934-8558-33ce950d845b2',
          // auto_continue: true,
          // api_key: bingU,
          // provider: 'BingCreateImages',
          // model: '',
          // web_search: false,
          model: 'meta/meta-llama-3-70b-instruct',
          provider: 'Llama',
          // messages: [...nextMsg],
        }),
      });
      if (!response.ok || !response.body) {
        throw response.statusText;
      }
      // console.log('response', response);
      const data = await response.json();
      if (!data) return;
      const newMessage = {
        ...data?.choices?.[0]?.message,
        id: Math.random().toString(36).substring(2, 9),
      };
      setChatList((prevChatList) => [...prevChatList, newMessage]);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div style={{ background: token.colorBgLayout }}>
      <ProChat
        sendMessageRequest={async (messages) => {
          await fetchData(messages);
        }}
        locale="en-US"
        chatList={chatList}
      />
    </div>
  );
}
