/**
 * webpack option type define
 *
 * @flow
 */

/// code

type Entry$Base = string | Array<string>
type Entry$Complex = { [name: string]: Entry$Base }
export type Entry =
  | Entry$Base
  | Entry$Complex
  | any => Entry$Base | Entry$Complex
  | any => Promise<Entry$Base | Entry$Complex>

export type WebpackOptions = {
  mode?:
    | 'development'
    | 'production'
    | 'none',
  target?:
    | 'async-node'
    | 'atom'
    | 'electron'
    | 'electron-main'
    | 'electron-renderer'
    | 'node'
    | 'node-webkit'
    | 'web'
    | 'webworker'
    | any => void,
  context?: string,
  entry?: Entry,
  output?: {
    path?: string,
    filename?:
      | string
      | () => string,
    publicPath?:
      | string
      | () => string,
    library?:
      | string
      | {
        root?: string,
        commonjs?: string,
        commonjs2?: string,
        amd?: string
      },
    libraryTarget?:
      | 'umd'
      | 'umd2'
      | 'commonjs2'
      | 'commonjs'
      | 'amd'
      | 'this'
      | 'var'
      | 'assign'
      | 'window'
      | 'global'
      | 'jsonp',
    libraryExport?:
      | string
      | Array<string>,
    pathinfo?: boolean,
    chunkFilename?: string,
    chunkLoadTimeout?: number,
    chunkCallbackName?: string,
    jsonpFunction?: string => string,
    jsonpScriptType?:
      | 'text/javascript'
      | 'module',
    sourceMapFilename?: string,
    devtoolModuleFilenameTemplate?:
      | string
      | ({
        absoluteResourcePath: string,
        allLoaders: string,
        hash: string,
        id: string,
        loaders: string,
        resource: string,
        resourcePath: string,
        namespace: string
      }) => string,
    devtoolFallbackModuleFilenameTemplate?:
      | string
      | ({
        absoluteResourcePath: string,
        allLoaders: string,
        hash: string,
        id: string,
        loaders: string,
        resource: string,
        resourcePath: string,
        namespace: string
      }) => string,
    devtoolNamespace?: string,
    crossOriginLoading?:
      | 'use-credentials'
      | 'anonymous'
      | false,
    devtoolLineToLine?: {
      test: RegExp
    },
    hotUpdateMainFilename?:
      | string
      | () => string,
    hotUpdateChunkFilename?:
      | string
      | () => string,
    hotUpdateFunction?: string => string,
    auxiliaryComment?:
      | string
      | {
        root?: string,
        commonjs?: string,
        commonjs2?: string,
        amd?: string
      },
    hashDigest?: string,
    hashDigestLength?: number,
    hashFunction?:
      | string
      | (string) => string,
    hashSalt?: string,
    sourceMapFilename?: string,
    sourcePrefix?: string,
    strictModuleExceptionHandling?: boolean,
    umdNamedDefine?: boolean,
  },
  externals?:
    | string
    | Array<string>
    | RegExp
    | { [name: string]: string }
    | { [name: string]: {
      root: string,
      commonjs2: string,
      commonjs: string,
      amd: string
    } }
    | (request: any) => string,
  devtool?:
    | boolean
    | 'eval'
    | 'cheap-eval-source-map'
    | 'cheap-module-eval-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'source-map'
    | 'inline-source-map'
    | 'hidden-source-map'
    | 'nosources-source-map',
  node?: {
    console?: boolean | 'mock',
    global?: boolean | 'mock',
    process?: boolean,
    __filename?: boolean | 'mock',
    __dirname?: boolean | 'mock',
    Buffer?: boolean | 'mock',
    setImmediate?: boolean | 'mock' | 'empty'
  },
  plugins?: Array<any>,
  parallelism?: number,
  profile?: boolean,
  bail?: boolean,
  cache?: boolean,
  watch?: boolean,
  watchOptions?: {
    aggregateTimeout?: number,
    poll?: boolean | number
  },
  recordsPath?: string,
  recordsInputPath?: string,
  recordsOutputPath?: string,
  performance?: {
    hints?:
      | 'warning'
      | 'error'
      | boolean,
    maxAssetSize?: number,
    maxEntrypointSize?: number,
    assetFilter?: string => boolean
  },
  stats?:
    | 'errors-only'
    | {
      assets?: boolean,
      colors?: boolean,
      errors?: boolean,
      errorDetails?: boolean,
      hash?: boolean
    },
  module?: {
    rules?: Array<>,
    unknownContextRequest?: string,
    unknownContextRecursive?: boolean,
    unknownContextRegExp?: RegExp,
    unknownContextCritical?: boolean,
    exprContextRequest?: 'string',
    exprContextRegExp?: RegExp,
    exprContextRecursive?: boolean,
    exprContextCritical?: boolean,
    wrappedContextRegExp?: RegExp,
    wrappedContextRecursive?: boolean,
    wrappedContextCritical?: boolean
  },
  resolve?: {
    modules?: Array<string>,
    extensions?: Array<string>,
    descriptionFiles?: Array<string>,
    mainFields?: Array<string>,
    aliasFields?: Array<string>,
    enforceExtension?: boolean,
    moduleExtensions?: Array<string>,
    enforceModuleExtension?: boolean,
    unsafeCache?: boolean | {},
    cachePredicate?: (path: string, request: any) => boolean,
    plugins?: Array<any>,
    alias?: {
      [name: string]: string
    } | Array<{
      name: string,
      alias: string,
      onluModule: boolean
    }>
  },
  optimization?: {
    minimize?: boolean,
    minimizer?: Array<any>,
    splitChunks?: {

    },
    runtimeChunk?:
      | string
      | boolean
      | {
        chunks?: 'async',
        minSize?: number,
        maxSize?: number,
        minChunks?: number,
        maxAsyncRequests?: number,
        maxInitialRequests?: number,
        automaticNameDelimiter?: string,
        name?: boolean,
        cacheGroups?: {
          [name: string]: {
            test?: RegExp,
            priority?: number,
            minChunks: number,
            reuseExistingChunk?: boolean
          }
        }
      },
    noEmitOnErrors?: boolean,
    namedModules?: boolean,
    namedChunks?: boolean,
    nodeEnv?: string | boolean,
    mangleWasmImports?: boolean,
    removeAvailableModules?: boolean,
    removeEmptyChunks?: boolean,
    mergeDuplicateChunks?: boolean,
    flagIncludedChunks?: boolean,
    occurrenceOrder?: boolean,
    providedExports?: boolean,
    usedExports?: boolean,
    concatenateModules?: boolean,
    sideEffects?: boolean,

  },
  devServer?: {
    contentBase?: string,
    port?: number,
    before?: (app: any) => any,
    after?: (app: any) => any,
    allowedHosts?: Array<string>,
    bonjour?: boolean,
    clientLogLevel?:
      | 'none'
      | 'error'
      | 'warning'
      | 'info',
    color?: boolean,
    compress?: boolean,
    disableHostCheck?: boolean,
    filename?: string,
    headers?: { [key: string]: string },
    historyApiFallback?:
      | boolean
      | {
        rewrites: Array<{
          from: string,
          to: string
        }>,
        disableDotRule: boolean
      },
    host?: string,
    hot?: boolean,
    hotOnly?: boolean,
    https?: boolean,
    index?: string,
    info?: boolean,
    inline?: boolean,
    lazy?: boolean,
    noInfo?: boolean,
    open?: boolean,
    openPage?: string,
    overlay?:
      | boolean
      | {
        warnings: boolean,
        errors: boolean
      },
    pfx?: string,
    pfxPassphrase?: string,
    proxy?: {
      [name: string]:
        | string
        | {
          target?: string,
          pathRewrite?: {
            [name: string]: string
          },
          secure?: boolean,
          bypass?: (req: any, res: any, proxyOptions: any) => string,
          context?: Array<string>
        }
    },
    progress?: boolean,
    publicPath?: string,
    quiet?: boolean,
    setup?: (app: any) => void,
    socket?: string,
    staticOptions?: {
      redirect?: boolean
    },
    stats?: string,
    stdin?: boolean,
    useLocalIp?: boolean,
    watchContentBase?: boolean,
    watchOptions?: {
      poll?: boolean
    },
    // public?: string,
  }
}
