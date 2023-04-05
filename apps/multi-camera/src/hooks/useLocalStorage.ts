/* eslint-disable no-nested-ternary */
import {
  Dispatch, SetStateAction, useCallback, useLayoutEffect, useRef, useState,
} from 'react';
import { isBrowser, noop } from '../utils';

type parserOptions<T> =
  | {
    raw: true;
  }
  | {
    raw: false;
    serializer: (value: T) => string;
    deserializer: (value: string) => T;
  };

const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  options?: any,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  if (!isBrowser) {
    return [initialValue as T, noop, noop];
  }
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const deserializer = options
    ? options.raw
      ? (value: any) => value
      : options.deserializer
    : JSON.parse;

  const initializer = useRef((newKey: string) => {
    try {
      const serializer = options ? (options.raw ? String : options.serializer) : JSON.stringify;

      const localStorageValue = localStorage.getItem(newKey);
      if (localStorageValue !== null) {
        return deserializer(localStorageValue);
      }
      initialValue && localStorage.setItem(newKey, serializer(initialValue));
      return initialValue;
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  const [state, setState] = useState<T | undefined>(() => initializer.current(key));

  useLayoutEffect(() => setState(initializer.current(key)), [key]);

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState = typeof valOrFunc === 'function' ? (valOrFunc as Function)(state) : valOrFunc;
        if (typeof newState === 'undefined') return;
        let value: string;

        if (options) {
          if (options.raw) {
            if (typeof newState === 'string') value = newState;
            else value = JSON.stringify(newState);
          } else if (options.serializer) value = options.serializer(newState);
          else value = JSON.stringify(newState);
        } else value = JSON.stringify(newState);

        localStorage.setItem(key, value);
        setState(deserializer(value));
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, setState],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(undefined);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [key, setState]);

  return [state, set, remove];
};

export default useLocalStorage;
