# script preset

Work with the main language compiler for *JavaScript*.

## usage

Quick set preset:

```js
builder('script').transform()
```

Or

```js
builder().use('script').transform()
```

## options

### options.compiler

What kind of compiler would you like to use? typed or not? The `options.compiler` value was one of `typescript` or `babel`, default to use `typescript`

```js
use('script', { compiler: 'typescript' })
```

### options.compressor

Use compressor to compress generate code at **production**. supports `uglify` (use uglify-es), `terser`, `closure-compiler` or `babel-minify`, default to `uglify`.

```js
use('script', { compresser: 'uglify' })
```
