'use strict'
const utils = require('./utils')
const npmCfg = require('../package.json')
const webpack = require('webpack')

const banner = [
  npmCfg.name + ' v' + npmCfg.version,
  '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
  npmCfg.homepage
].join('\n')

const config = {
  entry: utils.resolve('src/index.js'),
  output: {
    path: utils.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.resolve('src')],
        exclude: /node_modules/
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ]
}

module.exports = config
