---
title: strUpperCase
---

# strUpperCase

`strUpperCase` convert string to truncate three dot (xxx...) in the end of string

```tsx | pure
const ex1 = strUpperCase('Hello World', 3); // HELLO WORLD"
const ex2 = strUpperCase('Hello-World', 5); // "HELLO-WORLD"
```

```tsx
import React from 'react';
import strUpperCase from '.';

export default () => {
  const ex1 = strUpperCase('Hello World', 3); // HELLO WORLD"
  const ex2 = strUpperCase('Hello-World', 5); // "HELLO-WORLD"

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
