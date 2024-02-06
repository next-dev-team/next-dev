---
title: strKebabCase
---

`strKebabCase` convert string to strKebabCase

## strKebabCase

```tsx | pure
const input = 'string to test';
const ex1 = strKebabCase(input); // "string-to-test"
const ex2 = strKebabCase('StringToTest'); // "string-to-test"
```

```tsx
import React from 'react';
import strKebabCase from '.';

export default () => {
  const input = 'string to test';
  const ex1 = strKebabCase(input); // "string-to-test"
  const ex2 = strKebabCase('StringToTest'); // "string-to-test"

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
