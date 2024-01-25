---
title: isUndefined
---

`isUndefined` function is used to check whether a given value is an isUndefined.

## isUndefined

```tsx | pure
const ex1 = isUndefined(undefined); // true
const ex2 = isUndefined('true'); // false
const ex3 = isUndefined(1); // false
```

```tsx
import React from 'react';
import isUndefined from '.';

export default () => {
  const ex1 = isUndefined(undefined); // true
  const ex2 = isUndefined('true'); // false
  const ex3 = isUndefined(1); // false

  const output = JSON.stringify(
    {
      ex1,
      ex2,
      ex3,
    },
    null,
    2,
  );

  return output;
};
```
