/* eslint-disable */
import { ADMIN_API_SOCKET } from '../constants';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (
  url?: string,
  extraHeaders: { Authorization?: string } & Record<string, any> = {},
  isDebug = false,
) => {
  const [socket, setSocket] = useState<ReturnType<typeof io>>();
  const [socketConnect, setSocketConnect] = useState<Boolean | undefined>();
  useEffect(() => {
    const socketIo = io(url = ADMIN_API_SOCKET, {
      extraHeaders,
    });
    //! set socket ...
    setSocket(socketIo);
    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;
    // should only run once and not on every re-render,
    // so pass an empty array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! handle check connection
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('socket connected');
        setSocketConnect(true)
      });

      socket.on('disconnect', () => {
        // console.log('socket disconnected'); // true
        setSocketConnect(false)
      });

      socket.on('pong', (data) => {
        isDebug && console.log('pong', data);
      });

      socket.on('error_detection', (msg) => {
        isDebug && message.error(msg?.message);
      });
    }
    // should only run on every socket is triggered,
    // so pass an empty array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return { socket, socketConnect };
};
