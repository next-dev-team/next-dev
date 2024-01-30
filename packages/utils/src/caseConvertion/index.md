---
title: caseConversion
---

# caseConversion

`caseConversion` convert any data key to any case

## supported case

- snakeCase <-> camelCase

```tsx | pure
const input = {
  last_name: 'Doe',
  lastName: 'Doe',
};

const ex1 = caseConversion(input, 'camelCase'); //  { "lastName": "Doe", "lastNameNew": "Doe" }
const ex2 = caseConversion(input, 'snakeCase'); // { "last_name": "Doe", "last_name_new": "Doe" }
```

<code src="./demo.tsx">caseConversion</code>
