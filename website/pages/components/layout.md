```code
import { Layout } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../style/typo.css';
import Image from '../../asserts/ComponentLayout.png'

const placeholderStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#eee',
  borderRadius: '2px',
  fontSize: '12px',
  textAlign: 'center'
}

const containerStyle = {
  border: '1px solid #eee',
  borderRadius: '2px',
  minHeight: '12rem'
}

const styles = {
  col: {

  }
}
```

# <Layout />

<Layout center size="0" className={style.author}>
  <span>
    HariyRabbit
  </span>
</Layout>

<Layout center size="0">
  <img src={Image} width="560" />
</Layout>


`<Layout />` 是一个基础组件，用于快速构建视图层骨架，使用简单并具有丰富的属性，用来生成更干净的代码。

使用方式与[bootstrap](https://github.com/twbs/bootstrap)相似，但也有很明显的区别。`<Layout />`无法直接控制`col`，例如：


<Layout>
<Layout center fill>

```jsx
<Layout>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

</Layout>
<Layout center fill>

```jsx
<div class="row">
  <div class="col">
    <div>GRID</div>
  </div>
  <div class="col">
    <div>GRID</div>
  </div>
</div>
```

</Layout>
</Layout>



## 简单使用

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

<Layout vertical>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      1:2:1
    </Layout>
    <Layout size="1:2:1">
      <div style={placeholderStyle}>1</div>
      <div style={placeholderStyle}>2</div>
      <div style={placeholderStyle}>1</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      2:3:2
    </Layout>
    <Layout size="2:3:2">
      <div style={placeholderStyle}>2</div>
      <div style={placeholderStyle}>3</div>
      <div style={placeholderStyle}>2</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      1:1:1:1
    </Layout>
    <Layout size="1:1:1:1">
      <div style={placeholderStyle}>1</div>
      <div style={placeholderStyle}>1</div>
      <div style={placeholderStyle}>1</div>
      <div style={placeholderStyle}>1</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      1:10rem
    </Layout>
    <Layout size="1:10rem">
      <div style={placeholderStyle}>1</div>
      <div style={placeholderStyle}>10rem</div>
    </Layout>
  </Layout>
</Layout>


## 对齐方式

使用 align 属性来对齐栅格。align 的值是一个用 "," 分割的字符串，分别对应 justify-content 与 align-items：

```jsx
<Layout align="between">
  <div>GRID</div>
</Layout>
```

<Layout align="between" size="0.3:0.3" style={containerStyle}>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

```jsx
<Layout align=",center">
  <div>GRID</div>
</Layout>
```

<Layout align=",center" size="0.3" style={containerStyle}>
  <div style={placeholderStyle}>GRID</div>
</Layout>


可以使用 center 来快速居中，与 align="center,center" 相同：

```jsx
<Layout center>
  <div>GRID</div>
</Layout>
```

<Layout center size="0.3" style={containerStyle}>
  <div style={placeholderStyle}>GRID</div>
</Layout>


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

<Layout vertical>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      xs
    </Layout>
    <Layout gutter="xs">
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      sm
    </Layout>
    <Layout gutter="sm">
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      md
    </Layout>
    <Layout gutter="md">
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      lg
    </Layout>
    <Layout gutter="lg">
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      xl
    </Layout>
    <Layout gutter="xl">
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
      <div style={placeholderStyle}>GRID</div>
    </Layout>
  </Layout>
</Layout>

### 无槽宽

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


## 自定义标签

默认情况下，Layout 使用 div 标签作为 wrapper，可以通过 tag，tags，wrapper，wrappers 来自定义tag：

```jsx
<Layout tags={{ row: 'ul', col: 'li' }}>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>


// 转换成

<ul>
  <li><div>GRID</div></li>
  <li><div>GRID</div></li>
  <li><div>GRID</div></li>
</ul>
```

```code
const tags={ row: 'ul', col: 'li' }
const list = {listStyleType: 'none'}
```

<Layout list>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

就像上面演示的，可以用来做横向导航。


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


## 格子布局

```jsx
<Layout grid size="3:6:3">
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout grid size="3:6:3">
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>

## 响应式支持

```code
const gridsize = {
  default: '12:12:12',
  sm: '3:6:3',
  md: '4:4:4'
}
```

```jsx
<Layout grid size={{ default: '12:12:12', sm: '3:6:3', md: '4:4:4' }}>
  <div>GRID</div>
  <div>GRID</div>
  <div>GRID</div>
</Layout>
```

<Layout grid size={gridsize}>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
  <div style={placeholderStyle}>GRID</div>
</Layout>


## 构建变量

- LAYOUT_RESPONSE_SUPPORT && RESPONSE_SUPPORT
- BREAK_POINT
- LAYOUT_COLUMN
