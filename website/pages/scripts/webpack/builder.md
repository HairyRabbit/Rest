```code
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../../style/typo.css';
```

# Builder

一个简单易用的 Builder 用于快速构建 webpack 配置文件

## 基本用法

```js
/**
 * webpack.config.js
 */

import Builder from 'webpack-builder'

export Builder()
  .set('target', 'web')
  .transform()
```

Builder 提供一些工具方法来添加 entry、loader、plugin 等常用配置。这些方法大部分都有三个版本：

  - set
  - setDev
  - setProd

set 忽略 mode；setDev 与 setProd 只会在对应环境下发挥作用， 例如：

```js
Builder()
  .setDev('output.filename', '[name].js')
  .setProd('output.filename', '[name].[contenthash].js')
```

下面介绍的所有方法也都遵循这一规则。

同时 Builder 提供了一些预设，设置并修改这些预设可以方便的构建自己所需的功能。


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
  entry: {
    main: [ path.resolve('index.js') ]
  }
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
  entry: {
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
}
```

### 配置 Loader

Loader 是 webpack 核心功能，通过一系列的条件来加载不同类型的文件。

Builder 提供了基于文件类型的设置方式：

```js
Builder()
  .setRuleLoader('js', 'babel-loader')
  .transform()


// 转换为

{
  module: {
    rules: [{
      test: /\.(js)$/,
      use: [{
        loader: 'babel-loader', options: {}
      }]
    }]
  }
}
```

可以设置多次来串联 loader，当然是顺序相关的：

```js
Builder()
  .setRuleLoader('css', 'style-loader')
  .setRuleLoader('css', 'css-loader')
  .setRuleLoaderOptions('css', 'css-loader', {
    importLoaders: 2
  })
  .setRuleLoader('css', 'postcss-loader')
  .setRuleLoader('css', 'sass-loader')
  .transform()


// 转换为

{
  module: {
    rules: [{
      test: /\.(css)$/,
      use: [{
        loader: 'style-loader', options: {}
      },{
        loader: 'css-loader', options: { importLoaders: 2 }
      },{
        loader: 'postcss-loader', options: {}
      },{
        loader: 'sass-loader', options: {}
      }]
    }]
  }
}
```

对于设置多个文件类型情况，需要使用 setRuleFileTypes 来设置类型：

```js
Builder()
  .setRuleLoader('img', 'url-loader')
  .setRuleFileTypes('img', ['jpg', 'png', 'webp'])
  .transform()


// 转换为

{
  module: {
    rules: [{
      test: /\.(jpg|png|webp)$/,
      use: [{
        loader: 'url-loader', options: {}
      }]
    }]
  }
}
```


### 配置 Plugin

Plugin 也是 webpack 需要配置的必要属性，如最常见的 HtmlWebpackPlugin：

```js
import HtmlWebpackPlugin from 'html-webpack-plugin'

Builder()
  .setPlugin('html', HtmlWebpackPlugin, {
    title: 'App Title'
  })
  .transform()


// 转换为

{
  plugins: [
    new HtmlWebpackPlugin({
      title: 'App Title'
    })
  ]
}

```

Builder 会在 transform 时创建插件实例。

### 配置 Alias

TODO

### 配置 Library

TODO

## 改写现有配置

builder 可以用来改写现有配置

## 生成报表

TODO

## 预设项配置

TODO

### spa-preset

TODO

## 自定义预设

TODO
