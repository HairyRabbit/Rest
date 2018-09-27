```code
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../../style/typo.css';
import 'prismjs/themes/prism.css'
```

# Builder

一个简单易用的 builder 用于简单方便的构建webpack配置文件

## 基本用法

```js
import Builder from 'webpack-builder'

Builder().transform()
```

builder 提供一些工具方法来设置 entry, loader, plugin 等常用配置项

## 配置 Entry

使用 setEntry 来设置 entry：

```js
Builder()
  .setEntry('main', path.resolve('index.js'))
  .setEntryPrepends('main', ['@babel/polyfill'])


// 转换为

{
  main: ['@babel/polyfill', path.resolve('index.js')]
}
```

也可以通过配置 commonPrepends，在所有 entry 前追加：

```js
Builder()
  .addCommonPrepend('some-devtools')
  .setEntry('main', path.resolve('index.js'), ['@babel/polyfill'])
  .setEntry('foo', path.resolve('foo/index.js'))


// 转换为

{
  main: ['some-devtools', '@babel/polyfill', path.resolve('index.js')],
  foo: ['some-devtools', path.resolve('foo/index.js')]
}
```
