// const webpack = require('webpack')
const buildDate = JSON.stringify(new Date().toLocaleString())
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
  // configureWebpack: {
  //   // webpack plugins
  //   plugins: [
  //     // Ignore all locale files of moment.js
  //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  //     new webpack.DefinePlugin({
  //       APP_VERSION: `"${require('./package.json').version}"`,
  //       BUILD_DATE: buildDate
  //     }),
  //     new webpack.optimize.LimitChunkCountPlugin({
  //       maxChunks: 5
  //     })
  //   ],
  //   // if prod, add externals
  //   externals: {},
  //   output: {
  //     filename: 'nft-operation-web/[name].js',
  //     chunkFilename: 'nft-operation-web/[name].js'
  //   }
  // },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'aliasPath']
          });
          return JSON.stringify(tfPages.routes)
        }, true )
      })
    ]
  },
  transpileDependencies: ['uview-ui']
}
