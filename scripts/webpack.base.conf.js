'use strict'
const path = require('path')
const npmCfg = require('../package.json')
const webpack = require('webpack')

const banner = [
  npmCfg.name + ' v' + npmCfg.version,
  '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
  npmCfg.homepage
].join('\n')

const config = {
  context: path.resolve(__dirname, '../'),
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        // 匹配 *.worker.js
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: '[name]:[hash:8].js',
            inline: true,
            fallback: false
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
}

module.exports = config
