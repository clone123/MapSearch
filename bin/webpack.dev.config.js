/**
 * 开发模式
 */
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./config.js')
var baseWebpackConfig = require('./webpack.base.config.js')

var hotEntry = 'webpack-hot-middleware/client?http://localhost:' + config.port + '/&noInfo=true&reload=true'

module.exports = merge(baseWebpackConfig, {
  entry: {
    'index': [hotEntry, config.srcPath + '/main.js']
  },
  debug: true,
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader' +
      '!css-loader?modules&importLoaders=1&localIdentName=[local]-[hash:base64:7]' + // [name] 文件名 [local]原始样式名
      '!postcss-loader' +
      '!less-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
