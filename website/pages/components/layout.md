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

一个用于快速构建布局的组件


## 基本用法

```jsx
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

```jsx
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

```jsx
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

```jsx
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


```jsx
<Layout size="1:10rem">
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout size="1:10rem">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

## 对齐方式

TODO

## 栅栏偏移

TODO


## 嵌套

Layout 可以相互嵌套

```jsx
<Layout size="2:1">
  <Layout>
    <div>GRID</div>
    <div>GRID</div>
  </Layout>
  <Layout>
    <div>GRID</div>
    <div>GRID</div>
  </Layout>
</Layout>
```

<Layout size="2:1">
  <Layout>
    <div style={placeholderStyle}>GRID</div>
    <div style={placeholderStyle}>GRID</div>
  </Layout>
  <Layout>
    <div style={placeholderStyle}>GRID</div>
    <div style={placeholderStyle}>GRID</div>
  </Layout>
</Layout>


## 槽宽

```jsx
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

### 取消槽宽

将 gutter 设置为 false 可以去掉槽宽，实现栅格 edge-to-edge 的形式：

```jsx
<Layout gutter={false}>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout nogutter>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

也可以使用属性 nogutter 来设置，但要注意 nogutter 的优先级要高于 gutter：

```jsx
<Layout nogutter>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

### 自定义槽宽

除了使用内建的槽宽，还可以自定义槽宽。

```jsx
<Layout gutter="5rem">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout gutter="5rem">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>


## 垂直方向放置

可以添加属性 vertical 变为垂直方向的栅栏。但众所周知 Height 的特殊性，一些功能无法完成。

```jsx
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


## 响应式支持

TODO
