import { useEffect, useState } from 'react';

export default function useKeyPress(targetKeys: string[], isNum = false) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  const [key, setKey] = useState<number | string>();

  // If pressed key is our target key then set to true
  function keyHandler({ key = '', keyPressValue = false }): void {
    if (targetKeys.includes(key)) {
      setKeyPressed(keyPressValue);
    }
    setKey(isNum ? +key : key);
  }
  function downHandler({ key = '' }): void {
    keyHandler({ key, keyPressValue: true });
  }
  // If released key is our target key then set to false
  const upHandler = ({ key = '' }): void => {
    keyHandler({ key, keyPressValue: false });
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return { keyPressed, key };
}
