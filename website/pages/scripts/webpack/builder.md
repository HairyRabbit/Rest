```code
import { Avatar } from '~component'
import { avatar } from '@rabbitcc/faker'
import style from '../../../style/typo.css'
import { Header } from '../../../component'
```

# Builder()

一个简单易用的 Builder 用于帮助你快速构建 webpack 配置文件。


## 基本用法

```js
/**
 * webpack.config.js
 */

export Builder().transform()
```

`Builder` 提供一些工具方法来添加 `entry`、`loader`、`plugin` 等常用配置。这些方法大部分都有三个版本：

  - `set` - 设置属性，这里使用了 lodash.set，使得设置繁琐的复杂对象很方便
  - `setDev` - 作用相同，但只在 mode 为 development 时起作用
  - `setProd` - 与上楼作用相同，专用来设置产品环境

例如：

```js
Builder()
  .set('output.path', 'src')
  .setDev('output.filename', '[name].js')
  .setProd('output.filename', '[name].[contenthash].js')


// when NODE_ENV === "development", transform to:

{
  output: {
    path: 'src',
    filename: '[name].js'
  }
}


// when NODE_ENV === "production", transform to:

{
  output: {
    path: 'src',
    filename: '[name].[contenthash].js'
  }
}
```

下面介绍的所有方法也都遵循这一规则。

同时 Builder 提供了一些预设，设置并修改这些预设可以方便的构建自己所需的功能。


## 使用预设 Preset

将预设名称作为第一个参数传入 Builder 即可：

```js
Builder('spa')
```

也可以混着来，以`,`分割，但要注意是顺序相关的：

```js
Builder('icon,spa')
```

有一些已经写好的内建 Preset：

  - `server` - WebpackDevServer 开发服务器相关配置
  - `babel` - 主要是 babel-loader 的相关配置
  - `style` - 样式相关配置
  - `image` - 加载图片
  - `icon` - 加载图标
  - `spa` - 混合了 babel 与 style，并添加了一些更常用配置


### 检查依赖是否安装

每个 preset 都需要安装相关的依赖，比如 `babel` 依赖于 `babel-loader`, `@babel/core`, `@babel/preset-env` 等。那么在使用 `babel` 时，Builder 会检查相关的依赖是否已经安装，否则将给出一个警告：

```extend
[Builder] Warning:

These presets require dependencies, but not resolved:

  [spa] foo, bar

Run command to fix:

  npm install -D foo bar
```

emm…… 或许也可以自动安装，笑。这个功能是默认开启的，关闭他可以将 `disableCheck` 设置为 `true`：

```js
Builder('spa', { disableCheck: true })
```

默认情况下会检查 `webpack`，`webpack-cli`。

## 配置 Entry

Entry 是应用程序的入口，在 webpack 中默认为 ./src/index.js。
使用 setEntry 方法来设置 entry：

```js
Builder()
  .setEntry('main', path.resolve('index.js'))
  .transform()

// transform to:

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


// transform to

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

## 配置 Loader

Loader 是 webpack 核心功能，通过一系列的条件来加载不同类型的文件。

Builder 提供了基于文件类型的设置方式：

```js
Builder()
  .setRuleLoader('js', 'babel-loader')
  .transform()


// transform to

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


// transform to

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


## 配置 Plugin

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

### style-preset

```js
Builder('style')
```

`style` 提供了样式相关的常用配置。包括：

1. 默认启用 CSS Module，也可以使用传统构建方式，或同时使用两种策略
2. 使用 Sass 作为预处理器，使用 Postcss 作为后处理器
3. 在开发模式下支持热加载（HMR）
4. 在产品模式下开启优化及代码压缩



## 自定义预设

preset 只是一个普通的函数，自定义一个 preset 非常简单：

```js
/**
 * my-preset
 */

export default function preset(builder) {
  return builder
}

/**
 * webpack.config.js
 */

export default Builder('my-preset').transform()
```

这个 preset 什么都没做，下面可以添加一些插件：

```js
/**
 * my-preset
 */

import AwesomePlugin from '/path/to/awesome-plugin'

export default function preset(builder) {

  builder
    .setPlugin('name', AwesomePlugin, {})

  return builder
}
```
