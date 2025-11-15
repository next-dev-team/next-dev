import { request } from '@umijs/max';

const getToken = () => {
  try {
    return localStorage.getItem('petstoreToken') || '';
  } catch {
    return '';
  }
};

type RequestConfig = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: unknown;
  signal?: AbortSignal;
};

type RequestOptions = {
  headers?: Record<string, string>;
};


export const customRequest = async <T>(config: RequestConfig, options?: RequestOptions): Promise<T> => {
  const mergedHeaders = {
    ...(config.headers || {}),
    ...(options?.headers || {}),
    ...(getToken() ? { api_key: getToken(), Authorization: `Bearer ${getToken()}` } : {}),
  } as Record<string, string>;

  const resp = await request(config.url, {
    method: (config.method || 'GET') as any,
    headers: mergedHeaders,
    data: config.data as any,
    signal: config.signal as any,
    getResponse: true,
  });

  const data = resp.data as any;

  if (config.url.includes('/user/login') && (resp as any).status === 200 && typeof data === 'string') {
    try {
      localStorage.setItem('petstoreToken', data);
    } catch { }
  }

  return data as T;
};

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;
