---
title: asyncSleep
---

# asyncSleep

`asyncSleep`

```tsx | pure
asyncSleep(1000, { data: [] }).then((result) => {
  // output will show in 1000ms
  console.log(data); //output: { data: [] }
});

const getA = async () => {
  const delay = await asyncSleep(1000, { data: [] });
};
```

<code src="./demo.tsx">asyncSleep</code>
