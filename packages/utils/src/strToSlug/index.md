---
title: strToSlug
---

`strToSlug` convert string to slug

## strToSlug

```tsx | pure
const input = 'Hello World';
const ex1 = strToSlug(input); // "hello-world"
const ex2 = strToSlug('Hello-World'); // "hello-world"
```

```tsx
import React from 'react';
import strToSlug from '.';

export default () => {
  const input = 'Hello World';
  const ex1 = strToSlug(input); // "hello-world"
  const ex2 = strToSlug('Hello-World'); // "hello-world"

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
