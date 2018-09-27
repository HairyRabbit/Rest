```code
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../../style/typo.css';
import 'prismjs/themes/prism.css'
```

# Builder

一个简单易用的 Builder 用于快速构建 webpack 配置文件

## 基本用法

```js
/**
 * webpack.config.js
 */

import Builder from 'webpack-builder'

export Builder().transform()
```

Builder 提供一些工具方法来添加 entry、loader、plugin 等常用配置，同时也提供了
一些预设，继承并修改这些预设可以方便的构建自己所需的功能。

### 读取预设 Preset

将预设名称作为第一个参数传入 Builder 即可：

```js
Builder('spa')
  .transform()
```

可用的 Preset 目前只有：

  - spa

其他类型的预设还在开发中。


### 配置 Entry

Entry 是应用程序的入口，在 webpack 中默认为 ./src/index.js。
使用 setEntry 方法来设置 entry：

```js
Builder()
  .setEntry('main', path.resolve('index.js'))
  .transform()

// 转换为

{
  main: [ path.resolve('index.js') ]
}
```

可以通过 setEntryPrepends 和 setEntryCommonPrepends 为 entry 添加前置，前置通常为调试工具或 polyfills 类的代码。配置 commonPrepends 会在所有 entry 前追加：

```js
Builder()
  .setEntry('main', path.resolve('index.js'))
  .setEntry('foo', path.resolve('foo/index.js'))
  .setEntryPrepends('main', ['@babel/polyfill'])
  .setEntryCommonPrepends(['some-devtools'])
  .transform()


// 转换为

{
  main: [
    'some-devtools',
    '@babel/polyfill',
    path.resolve('index.js')
  ],
  foo: [
    'some-devtools',
    path.resolve('foo/index.js')
  ]
}
```

### 配置 Loader

### 配置 Plugin

### 配置 Alias

### 配置 Library

## 改写现有配置

builder 可以用来改写

## 生成报表

TODO

## 预设项配置

### spa-preset

## 自定义预设
