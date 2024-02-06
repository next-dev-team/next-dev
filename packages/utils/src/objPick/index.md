---
title: objPick
---

`pick` Pick some item from object.

## objPick

```tsx | pure
const input = { a: 1, b: 2, c: 3, d: 4 };
const ex1 = pick(input, 'a', 'b'); // { "a": 1, "b": 2 }
```

```tsx
import React from 'react';
import pick from '.';

export default () => {
  const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
  const ex1 = pick(input, 'a', 'b'); // { "a": 1, "b": 2 }

  const output = JSON.stringify(
    {
      ex1,
    },
    null,
    2,
  );

  return output;
};
```
