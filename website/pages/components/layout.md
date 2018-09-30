```code
import { Layout } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../style/typo.css';
import 'prismjs/themes/prism.css'

const placeholderStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#eee',
  borderRadius: '2px',
  fontSize: '12px',
  textAlign: 'center'
}
```

# <Layout />

## 基本用法

```js
<Layout>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>


## 栅栏宽度

```js
<Layout size="1:2:1">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout size="1:2:1">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

```js
<Layout size="2:3:3">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout size="2:3:3">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

```js
<Layout size="1:1:1:1">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout size="1:1:1:1">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>


```js
<Layout size="1:10rem">
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout size="1:10rem">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>


## 槽的尺寸

```js
<Layout gutter="md">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

### GutterSize XS

<Layout gutter="xs">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### GutterSize SM

<Layout gutter="sm">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### GutterSize MD

<Layout gutter="md">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### GutterSize LG

<Layout gutter="lg">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### GutterSize XL

<Layout gutter="xl">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### no gutter

```js
<Layout gutter={false}>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout gutter={false}>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

### Custom gutter size

TODO


## 垂直方向放置

```js
<Layout vertical>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout vertical>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>
