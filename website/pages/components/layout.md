```code
import { Layout, Avatar } from '~component'
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
```

# <Layout />

<Layout center size="0" className={style.author}>
  <span>
    @component/base
  </span>
</Layout>

<Layout center size="0">
  <img src={Image} width="560" />
</Layout>


`<Layout />` 是一个利用 flex 布局的基础组件，用于快速构建视图层骨架，使用简单并具有丰富的属性。使用方式与[Bootstrap](https://github.com/twbs/bootstrap)相似，但也有很明显的区别。比起 Bootstrap， `<Layout />` 可以转换成类似于 Bootstrap 的代码，但并不需要直接控制`col`，例如：


```jsx
<Layout>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>


/// 转换为如下代码

<div class="row">
  <div class="col">
    <div>COLUMN</div>
  </div>
  <div class="col">
    <div>COLUMN</div>
  </div>
</div>
```

没有了`col`，在编码时可以编写更为干净的代码。下面是很常见的三栏布局例子对比：

```jsx
/**
 * use bootstrap v4 grid system
 */

<div class="row">
  <div class="col-3">
    <img src="path/to/avatar" />
  </div>

  <div class="col">
    <div>HairyRabbit <small>一天前</small></div>
    <p>一个超棒的布局组件，覆盖90%的常见布局</p>
  </div>

  <div class="col-3">
    <button>Replay</button>
  </div>
</div>


/**
 * use <Layout />
 */

<Layout size="0:1">
  <img src="path/to/avatar" />

  <div>
    <div>HairyRabbit <small>一天前</small></div>
    <p>一个超棒的布局组件，覆盖90%的常见布局</p>
  </div>

  <button>Replay</button>
</Layout>
```

<Layout center>
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
  <Layout size="0:1">
    <Layout center fill>
      <Avatar value="https://avatars2.githubusercontent.com/u/5752902" />
    </Layout>
    <Layout vertical gutter="xs" size="0">
      <div>
        <span style={{marginRight:'0.5rem'}}>HairyRabbit</span>
        <span style={{fontSize:'12px',color:'#aaa'}}>1 天前</span>
      </div>
      <div style={{fontSize:'14px',color:'#555'}}>
        一个超棒的布局组件，覆盖90%的常见布局
      </div>
    </Layout>
    <div style={{fontSize:'12px',color:'#aaa'}}>Replay</div>
  </Layout>
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>布局中常见的三栏布局</figcaption>
</figure>
</Layout>



## 简单使用

Layout 继承了 Bootstrap 的简单易用，根据使用频繁程度，默认情况下，Layout 下的元素是等宽的：

```jsx
<Layout>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout center>
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
<Layout>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>简单使用 生成等宽栅栏</figcaption>
</figure>
</Layout>


## 栅栏宽度

使用 `size` 属性可以定义 `col` 的宽度。数字表示占有比例，具体数值即为具体的宽度大小，分别对应 `flex-grow` 与 `flex-basis` 两个属性：

```jsx
<Layout size="1:2:1">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

更多例子：

<Layout center size="1">
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
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
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>size 属性与栅栏宽度</figcaption>
</figure>
</Layout>

### 设置 auto 值

在默认情况下，栅格是等宽的，即 `size="1:1"`，当需要设置栅格宽度为 auto 时，可以将 size 设为 0：

```jsx
<Layout size="0:1:0">
  <div>AUTO</div>
  <div>1</div>
  <div>AUTO COLUMN</div>
</Layout>
```

<Layout center size="1">
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
<Layout vertical>
  <Layout size="0:1:0">
    <div style={placeholderStyle}>AUTO</div>
    <div style={placeholderStyle}>1</div>
    <div style={placeholderStyle}>AUTO COLUMN</div>
  </Layout>
</Layout>
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>size="0" 默认宽度格子内容宽度</figcaption>
</figure>
</Layout>

但需要注意的是，如果`Layout`只有一个子元素，那这个`col`的 size 为 0，而不是 1。这么做的目的是为了与对应属性配合来简单的设置居中：

```jsx
<Layout>
  <div>AUTO</div>
</Layout>
```

<Layout center size="1">
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
<Layout vertical>
  <Layout>
    <div style={placeholderStyle}>AUTO</div>
  </Layout>
</Layout>
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>只有一个元素时，元素宽度为 auto</figcaption>
</figure>
</Layout>


### 了解 size 模式

如果 size 属性的值与格子数量不符，会采用特殊的匹配策略，默认为取模运算。当 Layout 子元素很多时，耶可以很方便的设置大小：

```jsx
<Layout size="1:2">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout center size="1">
<figure style={{margin: '0'}}>
<div style={{border:'1px solid #eee',padding:'1rem',boxShadow:'0 6px 20px -16px #000'}}>
<Layout vertical>
  <Layout size="1:2">
    <div style={placeholderStyle}>1</div>
    <div style={placeholderStyle}>2</div>
    <div style={placeholderStyle}>1</div>
    <div style={placeholderStyle}>2</div>
    <div style={placeholderStyle}>1</div>
  </Layout>
</Layout>
</div>
  <figcaption style={{fontSize:'12px',color:'#aaa',paddingTop:'0.5rem',textAlign:'center'}}>当 size 属性值小于栅格数量时 会交替经行填充</figcaption>
</figure>
</Layout>


可以使用占位符`..`来改变这一模式：

```jsx
<Layout size="1..:2">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

更多例子：


## 对齐方式

使用 align 属性来对齐栅格。align 的值是一个用 "," 分割的字符串，分别对应 justify-content 与 align-items：

```jsx
<Layout align="between">
  <div>COLUMN</div>
</Layout>
```

<Layout align="between" size="0.3:0.3" style={containerStyle}>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>

```jsx
<Layout align=",center">
  <div>COLUMN</div>
</Layout>
```

<Layout align=",center" size="0.3" style={containerStyle}>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>


可以使用 center 来快速居中，与 align="center,center" 相同：

```jsx
<Layout center>
  <div>COLUMN</div>
</Layout>
```

<Layout center size="0.3" style={containerStyle}>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>


## 嵌套

Layout 可以相互嵌套

```jsx
<Layout size="2:1">
  <Layout>
    <div>COLUMN</div>
    <div>COLUMN</div>
  </Layout>
  <Layout>
    <div>COLUMN</div>
    <div>COLUMN</div>
  </Layout>
</Layout>
```

<Layout size="2:1">
  <Layout>
    <div style={placeholderStyle}>COLUMN</div>
    <div style={placeholderStyle}>COLUMN</div>
  </Layout>
  <Layout>
    <div style={placeholderStyle}>COLUMN</div>
    <div style={placeholderStyle}>COLUMN</div>
  </Layout>
</Layout>


## 槽宽

```jsx
<Layout gutter="md">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout vertical>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      xs
    </Layout>
    <Layout gutter="xs">
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      sm
    </Layout>
    <Layout gutter="sm">
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      md
    </Layout>
    <Layout gutter="md">
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      lg
    </Layout>
    <Layout gutter="lg">
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
    </Layout>
  </Layout>
  <Layout align=",center" size="8rem:1">
    <Layout align="end,center" size="0">
      xl
    </Layout>
    <Layout gutter="xl">
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
      <div style={placeholderStyle}>COLUMN</div>
    </Layout>
  </Layout>
</Layout>

### 无槽宽

将 gutter 设置为 false 可以去掉槽宽，实现栅格 edge-to-edge 的形式：

```jsx
<Layout gutter={false}>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout nogutter>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>

也可以使用属性 nogutter 来设置，但要注意 nogutter 的优先级要高于 gutter：

```jsx
<Layout nogutter>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

### 自定义槽宽

除了使用内建的槽宽，还可以自定义槽宽。

```jsx
<Layout gutter="5rem">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout gutter="5rem">
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>


## 自定义标签

默认情况下，Layout 使用 div 标签作为 wrapper，可以通过 tag，tags，wrapper，wrappers 来自定义tag：

```jsx
<Layout tags={{ row: 'ul', col: 'li' }}>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>


// 转换成

<ul>
  <li><div>COLUMN</div></li>
  <li><div>COLUMN</div></li>
  <li><div>COLUMN</div></li>
</ul>
```

```code
const tags={ row: 'ul', col: 'li' }
const list = {listStyleType: 'none'}
```

<Layout list>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>

就像上面演示的，可以用来做横向导航。


## 垂直方向放置

可以添加属性 vertical 变为垂直方向的栅栏。但众所周知 Height 的特殊性，一些功能无法完成。

```jsx
<Layout vertical>
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout vertical>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>


## 格子布局

```jsx
<Layout grid size="3:6:3">
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout grid size="3:6:3">
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
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
  <div>COLUMN</div>
  <div>COLUMN</div>
  <div>COLUMN</div>
</Layout>
```

<Layout grid size={gridsize}>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
  <div style={placeholderStyle}>COLUMN</div>
</Layout>


## 浏览器兼容性

Layout 依赖于 css flex 与 React 框架，所以兼容性继承了 React 与支持浏览器对 flex 的兼容性。大多数浏览器都已支持了 flex 布局。


## 构建变量

构建变量用于在 webpack 编译时，开启某些特殊功能，或是为了减小包体尺寸而去掉不需要的功能。

- `LAYOUT_RESPONSE_ENABLE` - 是否开启响应式支持，默认继承自 `RESPONSE_ENABLE`，默认为 "0"
- `BREAK_POINT` - 响应式断点，包括 sm、md、lg、xl 时的大小，xs 无需设置，默认为 "0"
- `LAYOUT_GRID_ENABLE` - 是否开启类似于 Bootstrap 的栅格布局，默认为 "0"
- `LAYOUT_COLUMN` - 栅栏总数，在开启`LAYOUT_GRID_ENABLE`时生效，值为 12 或 24，默认为 "12"
- `LAYOUT_SIZE_PATTERN_ENABLE` - 是否开启额外的 size 模式编译支持，默认为 "0"


## 传送门

已关闭
