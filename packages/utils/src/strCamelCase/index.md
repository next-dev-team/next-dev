---
title: strCamelCase
---

`strCamelCase` convert string to camelCase

## strCamelCase

```tsx | pure
const input = 'string to test';
const ex1 = strCamelCase(input); // "stringToTest"
```

```tsx
import React from 'react';
import strCamelCase from '.';

export default () => {
  const input = 'string to test';
  const ex1 = strCamelCase(input);
  //output: "stringToTest"

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
