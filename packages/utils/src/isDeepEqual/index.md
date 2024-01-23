---
title: isDeepEqual
---

 `isDeepEqual` is A blazing fast equality comparison, either shallow or deep
 more detail <https://github.com/planttheidea/fast-equals>

## isDeepEqual

```tsx | pure
import { deepEqual } from '@next-dev/utils'

const objectA = { foo: { bar: 'baz' } };
const objectB = { foo: { bar: 'baz' } };

console.log(objectA === objectB); // false
console.log(deepEqual(objectA, objectB)); // true
```
