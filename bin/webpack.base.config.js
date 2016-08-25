var config = require('./config')
var webpack = require('webpack')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
  output: {
    path: config.distPath,
    publicPath: config.publicPath
  },
  module: {
    loaders: [ {
      test: /\.js$/,
      loader: 'babel',
      exclude: [/(node_modules|plugins)/, /\.worker.js$/]
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.worker.js$/,
      loader: 'babel!worker',
      exclude: /(node_modules|plugins)/
    }, {
      test: /\.(png|jpg|gif)\??.*$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'images/[name].[hash:7].[ext]'
      }
    }, {
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'fonts/[name].[ext]'
      }
    } ]
  },
  postcss: function () {
    return {
      plugins: [ precss, autoprefixer ]
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new AssetsPlugin()
  ]
}
