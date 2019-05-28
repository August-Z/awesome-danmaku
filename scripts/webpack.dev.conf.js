'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    globalObject: 'this',
  },
  devServer: {
    contentBase: path.join(__dirname, '../test/template'),
    index: 'index.html',
    clientLogLevel: 'warning',
    hot: false,
    inline: true,
    progress: true,
    compress: true,
    historyApiFallback: false,
    noInfo: false,
    headers: { "X-Custom-Header": "yes" },
    stats: { colors: true },
    host: HOST || '0.0.0.0',
    port: PORT || 9090,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    quiet: false,
    watchOptions: {
      poll: false
    }
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Awesome Danmaku Dev Runtime...',
      filename: './index.html',
      template: './test/index.html',
      inject: true,
      xhtml: true
    })
  ]
})

module.exports = devWebpackConfig
