---
title: objOmit
---

`omit` function is used to check whether a given value is an objOmit.

## objOmit

```tsx | pure
const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
const keysToOmit = ['b', 'd'];

const ex1 = omit(input, keysToOmit); //  { "a": 1, "c": 3 }
const ex2 = omit(input, 'a'); // { "b": 2, "c": 3, "d": 4 }
```

```tsx
import React from 'react';
import omit from '.';

export default () => {
  const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
  const keysToOmit = ['b', 'd'];

  const ex1 = omit(input, keysToOmit); //  { "a": 1, "c": 3 }
  const ex2 = omit(input, 'a'); // { "b": 2, "c": 3, "d": 4 }

  const output = JSON.stringify(
    {
      ex1,
      ex2,
    },
    null,
    2,
  );

  return output;
};
```
