import { useEffect, useState } from 'react';
import asyncSleep from '.';

export default function Demo() {
  const [state, setState] = useState({});

  useEffect(() => {
    asyncSleep(1000, { data: [] }).then((result) => {
      setState(result);
    });
  }, []);

  const output = JSON.stringify(state, null, 2);

  return <p>Async sleep: {output}</p>;
}
