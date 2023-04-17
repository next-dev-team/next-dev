const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};
export default isFunction;
