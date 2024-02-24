---
title: isString
---

`isString` function is used to check whether a given value is string.

## isString

```tsx | pure
const ex1 = isString('hello') // true
const ex2 = isString('true') // true
const ex3 = isString(1) // false
```

```tsx
import React from 'react'
import isString from '.'

export default () => {
  const ex1 = isString('hello') // true
  const ex2 = isString('true') // true
  const ex3 = isString(1) // false

  const output = JSON.stringify(
    {
      ex1,
      ex2,
      ex3,
    },
    null,
    2
  )

  return output
}
```
