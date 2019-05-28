'use strict'
const path = require("path")
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    common: './src/runtime/common.ts',
    esm: './src/runtime/esm.ts',
    browser: './src/runtime/browser.ts',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'danmaku.[name].js',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
  ]
})

module.exports = prodWebpackConfig
