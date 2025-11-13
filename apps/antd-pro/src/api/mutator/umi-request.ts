import { request } from '@umijs/max';

const getToken = () => {
  try {
    return localStorage.getItem('petstoreToken') || '';
  } catch {
    return '';
  }
};

export const customRequest = async <T>(url: string, options: RequestInit): Promise<T> => {
  const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  const headers = {
    ...(options.headers as Record<string, string> | undefined),
    ...(getToken() ? { api_key: getToken() } : {}),
  } as any;

  const resp = await request(url, {
    method: options.method as any,
    headers,
    data: body as any,
    signal: (options as any).signal,
    getResponse: true,
  });

  const response = resp.response as Response;
  const data = resp.data as any;

  if (url.includes('/user/login') && response.status === 200 && typeof data === 'string') {
    try {
      localStorage.setItem('petstoreToken', data);
    } catch { }
  }

  const headersObj = response && response.headers ? response.headers : new Headers();

  return { data, status: response?.status ?? 200, headers: headersObj } as T;
};

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;
