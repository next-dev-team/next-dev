---
nav:
  title: Icons(RN/Web)
toc: content
title: Install and Usage
---

`Icons` is completely use from Lucide icon

```bash
yarn add @next-dev/icons
yarn add  react-native-svg (React Native only)
```

## Usage

```tsx || pure
import { Fish } from '@next-dev/icons'
```

### Tamag UI

```tsx || pure
<Fish size="$4" color="orange" />
```

### Tailwind

```tsx || pure
<Fish className="w-11 h-11 fill-amber-500" />
```

```tsx
import { Fish } from '@next-dev/icons'
import { message } from 'antd'

export default () => {
  const onClick = () => message.info('Icon click')
  return (
    <>
      <Fish size="$4" color="orange" onClick={onClick} />
      <Fish className="w-11 h-11 fill-amber-500" onClick={onClick} />
    </>
  )
}
```
