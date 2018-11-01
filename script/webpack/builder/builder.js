/**
 * powerful webpack builder
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import { set, isEmpty, uniq, groupBy } from 'lodash'
import modulePath from './module-resolver'
import Entry from './entry'
import Rule from './rule'
import Plugin from './plugin'
import readEnv from './read-env'
import type { WebpackOptions, Mode as WebpackMode } from './webpack-options-type'
import type { Options as PresetStyleOptions } from './preset/style.js'


/// code

declare var __non_webpack_require__: Function

/**
 * packages all build-in presets under "./presets"
 */
const presetsContext = require.context('./preset', true, /\.js$/)

type Options = {
  debug?: boolean,
  logger?: Function,
  disableGuess?: boolean,
  disableCheck?: boolean
} & PresetStyleOptions

class Builder {
  webpackOptions: WebpackOptions
  options: Options
  mode: ?WebpackMode
  context: ?string
  output: ?string
  entry: Entry
  plugin: Plugin
  rule: Rule
  presets: { [name: string]: Array<string | [string, string]> }
  jobs: Array<Function>
  shared: Object
  checked: Array<{
    preset: string,
    dependencies: string,
    result: boolean
  }>
  transforms: Array<any>
  $key: string

  constructor(webpackOptions?: mixed, options?: Options) {
    this.options = options || {}
    this.webpackOptions = 'string' === typeof webpackOptions
      ? {}
      : (webpackOptions || {})
    this.mode = this.webpackOptions.mode || this.guessMode()

    this.rule = new Rule(this.webpackOptions.module && this.webpackOptions.module.rules)
    this.presets = []
    this.jobs = []
    this.shared = {}
    this.transforms = [ Entry, Plugin ]

    this.init()

    if(!this.options.disableGuess) {
      this.guessContext()
    }

    this
      .export(this, [
        'setContext',
        'setOutput'
      ], 'unshift')
      .export(this, [
        'set'
      ])
      .export(this.rule, [
        'setRule',
        'deleteRule',
        'clearRule',
        'setRuleTypes',
        'clearRuleTypes',
        'addRuleType',
        'deleteRuleType',
        'setRuleLoaders',
        'clearRuleLoaders',
        'setRuleLoader',
        'deleteRuleLoader',
        'setRuleLoaderOptions',
        'clearRuleLoaderOptions',
        'setRuleLoaderOption',
        'deleteRuleLoaderOption',
        'setRuleOptions',
        'clearRuleOptions',
        'setRuleOption',
        'deleteRuleOption',
        'setRuleExtract'
      ])

    /**
     * if "webpackOptions" was string, call install
     */
    if('string' === typeof webpackOptions) {
      this.install(webpackOptions)
    }
  }

  /**
   * initial hook
   */
  init() {
    this.transforms.forEach(({ init }) => {
      if('function' !==typeof init) return
      init(this)
    })
  }

  /**
   * install presets
   *
   * @todo Add BUILDER_PATH env for searcher
   */
  install(input: string) {
    const paths = process.env.WEBPACK_BUILDER_PATH

    uniq(input.split(',')).forEach(preset => {
      if(this.presets[preset]) return

      /**
       * resolve script path by order:
       *
       * 1. webpack/builder/preset/{name}.js
       * 2. WEBPACK_BUILDER_PATH/{name}.js
       * 3. node_modules/webpack-builder-preset-{name}
       *
       */
      let lib

      /**
       * search build-in
       */
      try {
        lib = presetsContext('./' + preset + '.js')
      } catch(e) {}

      /**
       * search node_modules
       */
      if(!lib) {
        try {
          lib = __non_webpack_require__(`webpack-builder-preset-${preset}`)
        } catch(e) {}
      }

      /**
       * search preset failed
       */
      if(!lib) {
        throw new Error(`Search Preset not found, "${preset}"`)
      }

      /**
       * search paths
       */
      if(paths) {
        paths.split(';').forEach(p => {
          try {
            lib = __non_webpack_require__(`${p.trim()}/${preset}.js`)
          } catch(e) {}
        })
      }

      const { default: call, install, dependencies } = lib
      this.presets[preset] = dependencies || []
      install && this.install(install)
      call(this)
    })

    return this
  }

  setMode(mode: WebpackMode) {
    this.mode = mode
    return this
  }

  resetMode() {
    this.mode = undefined
    return this
  }

  /**
   * guess which mode should be use
   *
   * @private
   */
  guessMode(): WebpackMode {
    return readEnv('NODE_ENV') || 'development'
  }

  /**
   * callWithMode, assert proc should call with current mode, if given mode
   * was setted and equal mode flag, push proc to jobs queue.
   *
   * @private
   */
  callWithMode(proc: string, fn: Function, entity?: any, mode?: string): * {
    return (...args: Array<any>): * => {
      if(mode && mode !== this.mode) return this
      // fn.apply(entity || this, args)
      this.jobs[proc](() => fn.apply(entity || this, args))
      return this
    }
  }

  /**
   * export method with "M", "MDev" and "MProd"
   *
   * @private
   */
  export(entity: any, fns: Array<string>, proc = 'push') {
    fns.forEach(name => {
      const fn = entity[name]
      this[name] = this.callWithMode(proc, fn, entity)
      this[name + 'Dev'] = this.callWithMode(proc, fn, entity, 'development')
      this[name + 'Prod'] = this.callWithMode(proc, fn, entity, 'production')
    })

    return this
  }

  /**
   * set options to webpackOptions, just wrapped "lodash.set"
   *
   * @private
   */
  _set(key: string, value: *) {
    set(this.webpackOptions, key, value)
    return this
  }

  /**
   * set webpackOptions with normal way
   */
  set(key: string, value: *) {
    return this._set(key, value)
  }

  /**
   * setOutput, set "webpackOptions.output.path", this will unshift to jobs
   */
  setOutput(output: string) {
    this.output = output
    return this
  }

  /**
   * setContext, set "webpackOptions.context", this will unshift to jobs
   */
  setContext(context: string) {
    this.context = path.isAbsolute(context) ? context : path.resolve(context)
    return this.guessEntry()
  }

  /**
   * guessContext
   *
   * by default, webpack set context to 'process.cwd()'
   * this method will set context to 'src', 'lib' and current
   * dir(also cwd)
   *
   * @private
   */
  guessContext() {
    const context = ['src', 'lib', '.']
          .map(dir => path.resolve(dir))
          .find(dir => fs.existsSync(dir))

    if(!context) return this
    return this.setContext(context)
  }

  /**
   * guessEntry
   *
   * by default, webpack set entry to "CONTEXT/src/index.js"
   * this method will set 'boot.js' first. you also override
   * entry with 'this.setEntry'
   *
   * @private
   */
  guessEntry() {
    if(!this.entry.isEmpty()) return this

    const entry = ['boot.js', 'index.js']
          .map(file => this.context
               ? path.resolve(this.context, file)
               : path.resolve(file))
          .find(file => fs.existsSync(file))

    if(!entry) return this
    return this.entry.setEntryModule(entry)
  }

  /**
   * check
   *
   * check dependencies was installed
   *
   * @private
   */
  check() {
    type Acc = {
      preset: string,
      dependencies: string,
      result: boolean
    }

    const acc: Array<Acc> = []
    const failed: Array<[string, string, string]> = []

    /**
     * check "webpack"
     */
    Array.from(['webpack', 'webpack-cli']).forEach(dep => {
      const preset = 'default'
      const res = modulePath(dep)
      if(!res) failed.push([preset, dep, 'D'])

      acc.push({
        preset,
        dependency: dep,
        result: Boolean(res)
      })
    })

    /**
     * check all presets
     */
    Object.keys(this.presets).forEach(preset => {
      const deps = this.presets[preset]
      deps.length && deps.forEach(dep => {
        const [ depen, flag ] = Array.isArray(dep) ? dep : [dep, 'D']
        const res = modulePath(depen)
        if(!res) failed.push([preset, depen, flag])

        acc.push({
          preset,
          dependency: depen,
          result: Boolean(res)
        })
      })
    })

    if(failed.length) {
      const groupByPreset = groupBy(failed, '0')
      const groupByFlag = groupBy(failed, '2')

      const content = Object.keys(groupByPreset).map(preset => {
        const deps = uniq(groupByPreset[preset].map(([ _, dep ]) => dep)).join(', ')
        return `  [${preset}] ${deps}`
      }).join('\n')

      const cmd = Object.keys(groupByFlag).map(flag => {
        const deps = uniq(groupByFlag[flag].map(([ _, dep ]) => dep)).join(' ')
        return `  npm install -${flag} ${deps}`
      }).join('\n')

      console.warn(`
[Builder] Warning:

These presets require dependencies, but not resolved:

${content}

Run command to fix:

${cmd}

`)
    }

    this.checked = acc
  }

  report() {
    console.log(this.checked)
  }

  /**
   * transform
   *
   * transform and output webpackOptions
   */
  transform(report?: boolean): WebpackOptions {
    let fn
    while((fn = this.jobs.shift())) fn(this.shared)

    if(!this.options.disableCheck) {
      this.check()
    }

    this._set('mode', this.webpackOptions.mode || this.guessMode())
    this.context && this._set('context', this.context)
    this.output && this._set('output.path', this.output)

    this.transforms.forEach(({ setOption }) => {
      if('function' !== typeof setOption) return
      setOption(this)
    })

    // const transformPlugin = this.plugin.transform()
    // !isEmpty(transformPlugin) && this._set('plugins', transformPlugin)

    const transformRule = this.rule.transform()
    !isEmpty(transformRule) && this._set('module.rules', transformRule)

    if(report) {
      this.report()
    }

    return this.webpackOptions
  }
}

function builder(...args: Array<*>): Builder {
  return new Builder(...args)
}


/// export

export default builder


/// test

import assert from 'assert'
import sinon from 'sinon'

describe('Class Builder', () => {
  it('Builder.constructor', () => {
    assert(new Builder())
    assert(new Builder().transform)
  })

  it('Builder.constructor set preset', () => {
    assert(new Builder('spa'))
  })

  it('Builder.constructor set multi presets', () => {
    assert(new Builder('spa-spa'))
  })

  it('Builder.setMode', () => {
    assert.deepStrictEqual(
      'development',
      new Builder().setMode('development').mode
    )
  })

  it('Builder.resetMode', () => {
    assert.deepStrictEqual(
      undefined,
      new Builder()
        .setMode('development')
        .resetMode()
        .mode
    )
  })

  it('Builder.callWithMode', () => {
    const fake = sinon.fake()
    new Builder().callWithMode('push', fake)()
    assert(1 === fake.callCount)
  })

  it('Builder.callWithMode', () => {
    const fake = sinon.fake()
    new Builder()
      .setMode('development')
      .callWithMode('push', fake, undefined, 'development')()
    assert(1 === fake.callCount)
  })

  it('Builder.callWithMode not match Builder.mode', () => {
    const builder = new Builder()
    assert.deepStrictEqual(
      builder,
      builder
        .callWithMode('push', () => 42, 'production')()
    )
  })

  it('Builder.transform', () => {
    assert.deepStrictEqual({ mode: 'test' },
      new Builder(undefined, { disableGuess: true })
        .transform()
    )
  })

  it('Builder.set', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        foo: 'bar'
      },

      new Builder(undefined, { disableGuess: true })
        .set('foo', 'bar')
        .transform()
    )
  })

  it('Builder.set nest path', () => {
    assert.deepStrictEqual(
      {
        mode: 'test',
        foo: {
          bar: 'baz'
        }
      },

      new Builder(undefined, { disableGuess: true })
        .set('foo.bar', 'baz')
        .transform()
    )
  })

  it('Builder.setEntryModule', () => {
    assert.deepStrictEqual({
        mode: 'test',
        entry: {
          main: ['foo']
        }
      },

      new Builder(undefined, { disableGuess: true })
        .setEntryModule('foo')
        .transform()
    )
  })
})
