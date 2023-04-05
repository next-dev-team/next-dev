interface Message {
  type?: 'info' | 'debug' | 'warning' | 'error'
  at?: Date
  title: string
  message: any
  hide?: boolean
}

export const log = ({
  type = 'info', title, message, hide,
}: Message) => {
  const logMsg = ({
    at: new Date(),
    message,
  }) as Message;

  if (!hide) console[type as 'info'](`====>${title}`, logMsg);
};

export const info = (message: Message) => log({ type: 'info', ...message });
export const debug = (message: Message) => log({ type: 'debug', ...message });
export const warning = (message: Message) => log({ type: 'warning', ...message });
export const error = (message: Message) => log({ type: 'error', ...message });
