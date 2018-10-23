'use strict'

process.env.NODE_ENV = 'production'

const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackProdConfig = require('./webpack.prod.conf')
const npmCfg = require('../package.json')

const spinner = ora('building for production...')
spinner.start()

webpack(webpackProdConfig, (err, stats) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan(`Build complete of version: v${npmCfg.version}\n`))
})
