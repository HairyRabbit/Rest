(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{408:function(e,n,a){"use strict";a.r(n);var t=a(1),s=(a(118),a(412),a(410)),c=a.n(s);n.default=function(){return t.createElement("div",{className:c.a.main},t.createElement("h1",{className:c.a.header1},"Builder"),t.createElement("p",null,"一个简单易用的 Builder 用于快速构建 webpack 配置文件"),t.createElement("h2",{className:c.a.header2},"基本用法"),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token comment"},"/** * webpack.config.js */"),"\n\n",t.createElement("span",{className:"token keyword"},"import")," ","Builder ",t.createElement("span",{className:"token keyword"},"from")," ",t.createElement("span",{className:"token string"},"'webpack-builder'"),"\n\n",t.createElement("span",{className:"token keyword"},"export")," ",t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token keyword"},"set"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'target'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'web'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"))),t.createElement("p",null,"Builder 提供一些工具方法来添加 entry、loader、plugin 等常用配置。这些方法大部分都有三个版本："),t.createElement("p",null,"set"),t.createElement("p",null,"setDev"),t.createElement("p",null,"setProd"),t.createElement("p",null,"set 忽略 mode；setDev 与 setProd 只会在对应环境下发挥作用， 例如："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setDev"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'output.filename'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'[name].js'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setProd"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'output.filename'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'[name].[contenthash].js'"),t.createElement("span",{className:"token punctuation"},")"))),t.createElement("p",null,"下面介绍的所有方法也都遵循这一规则。"),t.createElement("p",null,"同时 Builder 提供了一些预设，设置并修改这些预设可以方便的构建自己所需的功能。"),t.createElement("h3",{className:c.a.header3},"读取预设 Preset"),t.createElement("p",null,"将预设名称作为第一个参数传入 Builder 即可："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'spa'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"))),t.createElement("p",null,"可用的 Preset 目前只有："),t.createElement("p",null,"spa"),t.createElement("p",null,"其他类型的预设还在开发中。"),t.createElement("h3",{className:c.a.header3},"配置 Entry"),t.createElement("p",null,"Entry 是应用程序的入口，在 webpack 中默认为 ./src/index.js。\n使用 setEntry 方法来设置 entry："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setEntry"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'main'"),t.createElement("span",{className:"token punctuation"},",")," ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'index.js'"),t.createElement("span",{className:"token punctuation"},")"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","entry",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","main",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"[")," ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'index.js'"),t.createElement("span",{className:"token punctuation"},")")," ",t.createElement("span",{className:"token punctuation"},"]"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("p",null,"可以通过 setEntryPrepends 和 setEntryCommonPrepends 为 entry 添加前置，前置通常为调试工具或 polyfills 类的代码。配置 commonPrepends 会在所有 entry 前追加："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setEntry"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'main'"),t.createElement("span",{className:"token punctuation"},",")," ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'index.js'"),t.createElement("span",{className:"token punctuation"},")"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setEntry"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'foo'"),t.createElement("span",{className:"token punctuation"},",")," ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'foo/index.js'"),t.createElement("span",{className:"token punctuation"},")"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setEntryPrepends"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'main'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token string"},"'@babel/polyfill'"),t.createElement("span",{className:"token punctuation"},"]"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setEntryCommonPrepends"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token string"},"'some-devtools'"),t.createElement("span",{className:"token punctuation"},"]"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","entry",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","main",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),"\n      ",t.createElement("span",{className:"token string"},"'some-devtools'"),t.createElement("span",{className:"token punctuation"},","),"\n      ",t.createElement("span",{className:"token string"},"'@babel/polyfill'"),t.createElement("span",{className:"token punctuation"},","),"\n      ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'index.js'"),t.createElement("span",{className:"token punctuation"},")"),"\n    ",t.createElement("span",{className:"token punctuation"},"]"),t.createElement("span",{className:"token punctuation"},","),"\n    ","foo",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),"\n      ",t.createElement("span",{className:"token string"},"'some-devtools'"),t.createElement("span",{className:"token punctuation"},","),"\n      ","path",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"resolve"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'foo/index.js'"),t.createElement("span",{className:"token punctuation"},")"),"\n    ",t.createElement("span",{className:"token punctuation"},"]"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("h3",{className:c.a.header3},"配置 Loader"),t.createElement("p",null,"Loader 是 webpack 核心功能，通过一系列的条件来加载不同类型的文件。"),t.createElement("p",null,"Builder 提供了基于文件类型的设置方式："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'js'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'babel-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","module",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","rules",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n      ","test",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token regex"},"/\\.(js)$/"),t.createElement("span",{className:"token punctuation"},","),"\n      ","use",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'babel-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n    ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("p",null,"可以设置多次来串联 loader，当然是顺序相关的："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'css'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'style-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'css'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'css-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoaderOptions"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'css'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'css-loader'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","importLoaders",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token number"},"2"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'css'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'postcss-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'css'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'sass-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","module",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","rules",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n      ","test",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token regex"},"/\\.(css)$/"),t.createElement("span",{className:"token punctuation"},","),"\n      ","use",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'style-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},","),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'css-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{")," ","importLoaders",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token number"},"2")," ",t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},","),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'postcss-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},","),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'sass-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n    ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("p",null,"对于设置多个文件类型情况，需要使用 setRuleFileTypes 来设置类型："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleLoader"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'img'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'url-loader'"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setRuleFileTypes"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'img'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token string"},"'jpg'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'png'"),t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token string"},"'webp'"),t.createElement("span",{className:"token punctuation"},"]"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","module",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","rules",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n      ","test",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token regex"},"/\\.(jpg|png|webp)$/"),t.createElement("span",{className:"token punctuation"},","),"\n      ","use",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),t.createElement("span",{className:"token punctuation"},"{"),"\n        ","loader",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'url-loader'"),t.createElement("span",{className:"token punctuation"},",")," ","options",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"{"),t.createElement("span",{className:"token punctuation"},"}"),"\n      ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n    ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},"]"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("h3",{className:c.a.header3},"配置 Plugin"),t.createElement("p",null,"Plugin 也是 webpack 需要配置的必要属性，如最常见的 HtmlWebpackPlugin："),t.createElement("pre",{className:c.a.codeblock},t.createElement("code",{className:"language-js"},t.createElement("span",{className:"token keyword"},"import")," ","HtmlWebpackPlugin ",t.createElement("span",{className:"token keyword"},"from")," ",t.createElement("span",{className:"token string"},"'html-webpack-plugin'"),"\n\n",t.createElement("span",{className:"token function"},"Builder"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"setPlugin"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token string"},"'html'"),t.createElement("span",{className:"token punctuation"},",")," ","HtmlWebpackPlugin",t.createElement("span",{className:"token punctuation"},",")," ",t.createElement("span",{className:"token punctuation"},"{"),"\n    ","title",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'App Title'"),"\n  ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"."),t.createElement("span",{className:"token function"},"transform"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},")"),"\n\n\n",t.createElement("span",{className:"token comment"},"// 转换为"),"\n\n",t.createElement("span",{className:"token punctuation"},"{"),"\n  ","plugins",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token punctuation"},"["),"\n    ",t.createElement("span",{className:"token keyword"},"new")," ",t.createElement("span",{className:"token className-name"},"HtmlWebpackPlugin"),t.createElement("span",{className:"token punctuation"},"("),t.createElement("span",{className:"token punctuation"},"{"),"\n      ","title",t.createElement("span",{className:"token punctuation"},":")," ",t.createElement("span",{className:"token string"},"'App Title'"),"\n    ",t.createElement("span",{className:"token punctuation"},"}"),t.createElement("span",{className:"token punctuation"},")"),"\n  ",t.createElement("span",{className:"token punctuation"},"]"),"\n",t.createElement("span",{className:"token punctuation"},"}"))),t.createElement("p",null,"Builder 会在 transform 时创建插件实例。"),t.createElement("h3",{className:c.a.header3},"配置 Alias"),t.createElement("p",null,"TODO"),t.createElement("h3",{className:c.a.header3},"配置 Library"),t.createElement("p",null,"TODO"),t.createElement("h2",{className:c.a.header2},"改写现有配置"),t.createElement("p",null,"builder 可以用来改写现有配置"),t.createElement("h2",{className:c.a.header2},"生成报表"),t.createElement("p",null,"TODO"),t.createElement("h2",{className:c.a.header2},"预设项配置"),t.createElement("p",null,"TODO"),t.createElement("h3",{className:c.a.header3},"spa-preset"),t.createElement("p",null,"TODO"),t.createElement("h2",{className:c.a.header2},"自定义预设"),t.createElement("p",null,"TODO"))}},410:function(e,n,a){e.exports={main:"_1i-7I",header1:"_2kyBs",header2:"_2qkXl",header3:"_3Ftd_",header4:"_9s0-r",header5:"_1dNO3",header6:"_3zIBz",codeblock:"_21y7C",example:"_10lhO",row:"_14kDd",col:"_1ylCP",icon:"_1lMcv",author:"_3wiUv"}}}]);