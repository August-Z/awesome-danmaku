'use strict'
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: [
    './src/runtime/esm.js',
    './test'
  ],
  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: 'danmaku.demo.js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
})

module.exports = prodWebpackConfig
