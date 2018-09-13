/**
 * a plugin for analyze bundle
 *
 * @link [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
 * @link [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer)
 * @flow
 */

import path from 'path'


/// code

class BundleAnalyzePlugin {
  constructor({ ...options }) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.done.tap('BundleAnalyzePlugin', stats => {
      const {
        entrypoints,
        namedChunkGroups,
        filteredModules,
        hash,
        time,
        builtAt,
        children,
        assetsByChunkName,
        assets,
        modules,
        chunks,
        errors,
        warnings
      } = stats.toJson()

      // console.log(entrypoints)
      // console.log(namedChunkGroups)
      // console.log(builtAt, hash, time, children)

      /**
       * asserts
       */
      // assets.forEach(transformAsset)
      // chunks.forEach(transformChunk)
      modules.forEach(transformModule)
    })
  }
}

function transformAsset({ chunkNames,
                          chunks,
                          emitted,
                          name,
                          size,
                          isOverSizeLimit,
                          ...asset }) {
  console.log(chunkNames, chunks, name, emitted, size, isOverSizeLimit)
}

/**
false [ 'vendors~component-avatar.a8301bb0934aa74c6f57.css',
  'vendors~component-avatar.310c8882001857e4cd6f.js',
  'vendors~component-avatar.310c8882001857e4cd6f.js.map' ] 3 0 false [ 'vendors~component-avatar' ] [ { moduleId: 4,
    module:
     'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\index.js',
    moduleIdentifier:
     'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\index.js',
    moduleName: './index.js',
    loc: '16:11-18:35',
    request: './pages/components/avatar.md',
    reasons: [] } ] [ 0 ] true 531552 { recorded: undefined,
  reason:
   'split chunk (cache group: vendors) (name: vendors~component-avatar)',
  hash: '310c8882001857e4cd6f',
  siblings: [ 1 ],
  children: [],
  childrenByOrder: {} }
*/
function transformChunk({ entry,
                          files,
                          id,
                          filteredModules,
                          initial,
                          modules,
                          names,
                          origins,
                          parents,
                          rendered,
                          size,
                          hash,
                          recorded,
                          reason,
                          siblings,
                          children,
                          childrenByOrder,
                          ...chunk }) {
  console.log(
    entry,
    files,
    id,
    filteredModules,
    initial,
    names, origins, parents,
    rendered,
    size,
    chunk
  )
}

/**
true true 0 false 146 'd:\\Workspace\\Rest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js??ref--6-0!d:\\Workspace\\Rest\\node_modules\\css-loader\\index.js??ref--6-1!d:\\Workspace\\Rest\\node_modules\\postcss-loader\\src\\index.js??ref--6-2!d:\\Workspace\\Rest\\node_modules\\prismjs\\themes\\prism.css' '../node_modules/prismjs/themes/prism.css' false false undefined 39 0

false undefined 0 false 147 'css d:\\Workspace\\Rest\\node_modules\\css-loader\\index.js??ref--6-1!d:\\Workspace\\Rest\\node_modules\\postcss-loader\\src\\index.js??ref--6-2!d:\\Workspace\\Rest\\node_modules\\prismjs\\themes\\prism.css 0' 'css ../node_modules/css-loader??ref--6-1!../node_modules/postcss-loader/src??ref--6-2!../node_modules/prismjs/themes/prism.css' false false undefined 2220 0

{ index: 150,
  index2: 150,
  issuer:
   'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--7-0!d:\\Workspace\\Rest\\script\\webpack\\markdown-loader.js??ref--7-1!d:\\Workspace\\Rest\\website\\pages\\components\\avatar.md',
  issuerId: null,
  issuerName: './pages/components/avatar.md',
  issuerPath:
   [ { id: 7,
       identifier: 'multi d:\\Workspace\\Rest\\website\\boot.js',
       name: 'multi ./boot.js',
       profile: undefined },
     { id: 8,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\boot.js',
       name: './boot.js',
       profile: undefined },
     { id: 4,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\index.js',
       name: './index.js',
       profile: undefined },
     { id: null,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--7-0!d:\\Workspace\\Rest\\script\\webpack\\markdown-loader.js??ref--7-1!d:\\Workspace\\Rest\\website\\pages\\components\\avatar.md',
       name: './pages/components/avatar.md',
       profile: undefined } ],
  usedExports: false,
  providedExports: null,
  optimizationBailout:
   [ 'ModuleConcatenation bailout: Module is not an ECMAScript module' ],
  depth: 4 }

{ index: 151,
  index2: 149,
  issuer:
   'd:\\Workspace\\Rest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js??ref--6-0!d:\\Workspace\\Rest\\node_modules\\css-loader\\index.js??ref--6-1!d:\\Workspace\\Rest\\node_modules\\postcss-loader\\src\\index.js??ref--6-2!d:\\Workspace\\Rest\\node_modules\\prismjs\\themes\\prism.css',
  issuerId: 146,
  issuerName: '../node_modules/prismjs/themes/prism.css',
  issuerPath:
   [ { id: 7,
       identifier: 'multi d:\\Workspace\\Rest\\website\\boot.js',
       name: 'multi ./boot.js',
       profile: undefined },
     { id: 8,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\boot.js',
       name: './boot.js',
       profile: undefined },
     { id: 4,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--4-0!d:\\Workspace\\Rest\\website\\index.js',
       name: './index.js',
       profile: undefined },
     { id: null,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\babel-loader\\lib\\index.js??ref--7-0!d:\\Workspace\\Rest\\script\\webpack\\markdown-loader.js??ref--7-1!d:\\Workspace\\Rest\\website\\pages\\components\\avatar.md',
       name: './pages/components/avatar.md',
       profile: undefined },
     { id: 146,
       identifier:
        'd:\\Workspace\\Rest\\node_modules\\mini-css-extract-plugin\\dist\\loader.js??ref--6-0!d:\\Workspace\\Rest\\node_modules\\css-loader\\index.js??ref--6-1!d:\\Workspace\\Rest\\node_modules\\postcss-loader\\src\\index.js??ref--6-2!d:\\Workspace\\Rest\\node_modules\\prismjs\\themes\\prism.css',
       name: '../node_modules/prismjs/themes/prism.css',
       profile: undefined } ],
  usedExports: true,
  providedExports: null,
  optimizationBailout:
   [ 'ModuleConcatenation bailout: Module is not an ECMAScript module' ],
  depth: 5 }
 */

function transformModule({ assets,
                           chunks,
                           reasons,
                           built,
                           cacheable,
                           errors,
                           failed,
                           warnings,
                           id,
                           identifier,
                           name,
                           optional,
                           prefetched,
                           profile,
                           size,
                           source,
                           index,
                           index2,
                           issuer,
                           issuerId,
                           issuerName,
                           issuerPath,
                           usedExports,
                           providedExports,
                           optimizationBailout,
                           depth,
                           ...module }) {
  // console.log(source)
}

function isSourceMapFile({ chunks, name }): boolean %checks {
  return '.map' === path.extname(name) && !chunks.length
}



/// export

export default BundleAnalyzePlugin
