'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: [
    './src/runtime/esm.js',
    './test/index.js'
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    hot: false,
    compress: true,
    contentBase: false,
    host: HOST || '0.0.0.0',
    port: PORT || 9090,
    open: false,
    index: 'dev.html',
    inline: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    proxy: {},
    quiet: true,
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Awesome Danmaku Dev Runtime',
      filename: 'dev.html',
      template: 'dev.html',
      inject: true
    })
  ]
})

module.exports = devWebpackConfig
