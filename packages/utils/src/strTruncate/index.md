---
title: strTruncate
---

# strTruncate

`strTruncate` convert string to truncate three dot (xxx...) in the end of string

```tsx | pure
const input = 'Hello World';
const ex1 = strTruncate(input, 3); // "Hel..."
const ex2 = strTruncate('Hello-World', 5); // "Hello..."
```

```tsx
import React from 'react';
import strTruncate from '.';

export default () => {
  const input = 'Hello World';
  const ex1 = strTruncate(input, 3); // "Hel..."
  const ex2 = strTruncate('Hello-World', 5); // "Hello..."

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
