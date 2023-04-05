export default async function asyncSleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function httpPost(url: string, data?: any, signal?: any) {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
    signal,
  });
  if (response.ok) {
    return response.json();
  }
  return Promise.reject();
}
