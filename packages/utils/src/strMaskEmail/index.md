---
title: strMaskEmail
---

# strMaskEmail

`strMaskEmail` mask string to two show only first specify length to show

```tsx | pure
const ex1 = strMaskEmail('hello@gmail.com'); // "he***@gmail.com"
const ex2 = strMaskEmail('hellodeveloper@gmail.com'); // "he************@gmail.com"
```

```tsx
import React from 'react';
import strMaskEmail from '.';

export default () => {
  const ex1 = strMaskEmail('hello@gmail.com'); // "he***@gmail.com"
  const ex2 = strMaskEmail('hellodeveloper@gmail.com'); // "he************@gmail.com"

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
