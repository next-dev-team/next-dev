import type { ConnectionOptions, NatsConnection } from 'nats';
import { connect } from 'nats';
import {
  MQ_HOST,
  MQ_PASSWORD,
  MQ_PORT,
  MQ_USER,
} from '../constants';

const getProps = (props: any = {}): Record<string, any> => ({
  host: MQ_HOST,
  port: MQ_PORT,
  user: MQ_USER,
  pass: MQ_PASSWORD,
  ...props,
});

const getConnection = (pProps: Record<string, string> = {}): ConnectionOptions => {
  const {
    host, port, user, pass,
  } = getProps(pProps);
  return {
    servers: `${host}:${port}` as any,
    user,
    pass,
  };
};

export default function connectToMq(): Promise<NatsConnection> {
  const connection = getConnection();
  return connect(connection);
}
