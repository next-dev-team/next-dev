---
title: noop
---

# noop

`noop` function does nothing

```tsx | pure
const ex1 = noop(); // return noting ''
```

```tsx
import React from 'react';
import noop from '.';

export default () => {
  const ex1 = noop();

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
