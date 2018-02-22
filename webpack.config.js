/* eslint-disable */

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// Environment check
var isProd = process.env.NODE_ENV === 'production';

process.traceDeprecation = true;

// Plugin configuration
var webpackPlugins = [
  new HtmlWebpackPlugin({
    title: 'Airtame Icons',
    hash: true,
    template: './src/site/index.pug',
  }),
  new webpack.optimize.OccurrenceOrderPlugin(true),
];

if (isProd) {
  // Production webpack plugins
  // Uglify
  webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
  // Remove all development logs from dependencies
  webpackPlugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    })
  );
}

var config = {
  entry: [path.resolve(__dirname, 'src/site/index.jsx')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // Initial pug template
        test: /\.(pug)$/,
        use: ['html-loader', 'pug-html-loader'],
      },
      {
        // All JS/React files
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'stage-1'],
            },
          },
        ],
      },
      {
        // SCSS Compilation
        test: /\.(sass|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [require('autoprefixer')({ browsers: ['last 2 versions'] })],
            },
          },
        ],
      },
      {
        // JSON loader
        test: /\.json$/,
        loader: 'json-loader', //JSON loader
      },
      {
        // Fonts
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: webpackPlugins,
  devtool: 'eval-source-map', // Default development sourcemap
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    open: true,
  },
};

// Change sourcemap if production
if (isProd) {
  config.devtool = 'source-map';
}

module.exports = config;
