import { useRef } from 'react';

/**
 * constructor class like, Occurs ONCE, BEFORE the initial render.
 * @param callBack
 * @see https://dev.to/bytebodger/constructors-in-functional-components-with-hooks-280m#comment-ndbf
 * @example
 *   useConstructor(() => {
    console.log(
      'Occurs ONCE, BEFORE the initial render.'
    );
 */
export default function useConstructor(callBack = () => { }) {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
  callBack();
  hasBeenCalled.current = true;
};
