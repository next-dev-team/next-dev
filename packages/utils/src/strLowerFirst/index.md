---
title: strLowerFirst
---

`strLowerFirst` convert string to lower first character

## strLowerFirst

```tsx | pure
const ex1 = strLowerFirst(input); // "world"
const ex2 = strLowerFirst('StringToTest'); // "stringToTest"
```

```tsx
import React from 'react';
import strLowerFirst from '.';

export default () => {
  const input = 'World';
  const ex1 = strLowerFirst(input); // "world"
  const ex2 = strLowerFirst('StringToTest'); // "stringToTest"

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
