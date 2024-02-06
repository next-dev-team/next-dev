---
title: isFormData
---

`isFormData` function is used to check whether a given value is an FormData.

## Docs

```tsx | pure
isFormData({}); // false
isFormData(true); // false
isFormData([]); // false
```

## Demo

```tsx
import isFormData from '.';

export default () => {
  const itsFormData = isFormData({});

  const output = JSON.stringify(
    {
      itsFormData,
    },
    null,
    2,
  );

  return (
    <div style={{ backgroundColor: 'rgb(253 248 250)', padding: 10 }}>
      Output:
      <pre>{output} </pre>
    </div>
  );
};
```
