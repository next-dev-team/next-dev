---
title: strCapitalize
---

`strCapitalize` convert string to strCapitalize

## strCapitalize

```tsx | pure
const input = 'string to test';
const ex1 = strCapitalize(input); // "String to test"
```

```tsx
import React from 'react';
import strCapitalize from '.';

export default () => {
  const input = 'string to test';
  const ex1 = strCapitalize(input); // "String to test"

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
