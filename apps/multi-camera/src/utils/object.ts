import React from 'react';
/**
 * define css style
 * @param obj
 */
export const defineStyle = <
  T extends React.CSSProperties
>(
  obj: T,
) => {
  return obj;
};

/**
 * define css style
 * @param obj
 */
export const defineNesStyle = (
  obj: Record<string, React.CSSProperties>,
) => {
  return obj;
};
