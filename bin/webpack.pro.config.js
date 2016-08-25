/**
 * 发布模式
 */
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config.js')
var config = require('./config.js')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: {
    'index': config.srcPath + '/main.js'
  },
  devtool: 'cheap-source-map',
  module: {
    loaders: [ {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract([ 'css-loader' ])
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract([
        // [name] 文件名 [local]原始样式名
        'css-loader?modules&importLoaders=1&localIdentName=[local]-[hash:base64:7]',
        'less-loader'
      ])
    } ]
  },
  output: {
    filename: '[name].bundle.[hash:8].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        cascade: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    }),
    new ExtractTextPlugin('[name].[contenthash:8].css')
  ]
})
