---
title: isObject
---

`isObject` function is used to check whether a given value is an object.

## isObject

```tsx | pure
const ex1 = isObject(true); // true
const ex2 = isObject('true'); // false
```

```tsx
import React from 'react';
import isObject from '.';

export default () => {
  const ex1 = isObject(true); // true
  const ex2 = isObject('true'); // false
  const output = JSON.stringify(
    {
      ex2,
      ex1,
    },
    null,
    2,
  );

  return output;
};
```
