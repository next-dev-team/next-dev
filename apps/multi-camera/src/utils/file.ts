/* eslint-disable import/prefer-default-export */

import { writeFileSync, existsSync, readFileSync } from 'fs';

export function base64ToBinary(dataURI: string) {
  const splitDataURI = dataURI.split(',');
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }

  return new Blob([ia], { type: mimeString });
}

export const writeFile = (filePath: string, data: string | NodeJS.ArrayBufferView) => {
  const exists = existsSync(filePath);

  if (!exists) {
    const error = JSON.stringify({
      error: true,
      message: 'file is required',
      path: filePath,
    });
    throw new Error(error);
  }
  const content = writeFileSync(filePath, data);
  return content;
};

export const readFile = (filePath: string) => {
  const exists = existsSync(filePath);

  if (!exists) {
    const error = JSON.stringify({
      error: true,
      message: 'file is required',
      path: filePath,
    });
    throw new Error(error);
  }
  const content: string = readFileSync(filePath).toString();
  return content;
};
