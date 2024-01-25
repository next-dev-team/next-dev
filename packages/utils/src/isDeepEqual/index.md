---
title: isEqual
---

# isEqual

`isEqual` is A blazing fast equality comparison, either shallow or deep
more detail <https://github.com/planttheidea/fast-equals>

## isDeepEqual

```tsx | pure
import { deepEqual } from '.'

  const objectA = { foo: { bar: 'baz' }, a: <h1>html</h1> };
  const objectB = { foo: { bar: 'baz' }, a: <h1>html</h1> };

# Usage example
// Using deepEqual
 deepEqual(objectA, objectB), // true

// Using normal JS
 objectA === objectB // false

// Using Json Stringify
JSON.stringify(objectA) === JSON.stringify(objectB) // error occur

// structuredClone
 structuredClone(objectA) === structuredClone(objectB) // error occur

```

```tsx
/**
 * title: Demo Code
 */
import { deepEqual } from '.';

export default () => {
  const objectA = { foo: { bar: 'baz' }, a: <></> };
  const objectB = { foo: { bar: 'baz' }, a: <></> };

  const isDeepEqual = deepEqual(objectA, objectB); // true

  const normalJs = objectA === objectB; // false

  const jsonCompare = () => {
    try {
      return JSON.stringify(objectA) === JSON.stringify(objectB);
    } catch (err) {
      // console.log('err', err);
      return `starting at object with constructor 'Object`;
    }
  };

  const jsStructuredClone = () => {
    try {
      return structuredClone(objectA) === structuredClone(objectB);
    } catch (err) {
      console.log('err', err);
      return `Uncloneable type: Symbol at throwUncloneable`;
    }
  };

  const output = JSON.stringify(
    {
      isDeepEqual,
      normalJs,
      json: jsonCompare(),
      jsStructuredClone: jsStructuredClone(),
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
