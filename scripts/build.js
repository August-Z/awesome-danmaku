const path = require('path')
const webpack = require('webpack')
const npmCfg = require('../package.json')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const banner = [
  npmCfg.name + ' v' + npmCfg.version,
  '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
  npmCfg.homepage
].join('\n')

const config = {
  entry: path.resolve(__dirname, '../') + '/src',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, '../') + '/dist',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
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
