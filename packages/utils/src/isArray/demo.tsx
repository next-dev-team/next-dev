import isArray from '.';

export default function Demo() {
  const arr = [1, 2, 3];
  const checkIsArr = isArray(arr);

  return <div>{String(checkIsArr)}</div>;
}
