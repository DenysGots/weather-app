const webpack = require('webpack');
const WebpackConfigFactory = require('@nestjs/ng-universal').WebpackConfigFactory;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

/**
 * In fact, passing following configuration to the WebpackConfigFactory is not required
 * default options object returned from this method has equivalent entries defined by default.
 *
 * Example: WebpackConfigFactory.create(webpack);
 */
const webpackConfig = WebpackConfigFactory.create(webpack, {
  // This is our Nest server for Dynamic universal
  server: './server/main.ts',
  // This is an example of Static prerendering (generative)
  prerender: './prerender.ts'
});

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'sass-loader',
      options: {
        plugins: () => autoprefixer({
          browsers: ['last 3 versions', '> 1%']
        })
      }
    }
  ]
});

webpackConfig.plugins.push(new MiniCssExtractPlugin({
  filename: '[name].css',
  allChunks: true
}));

module.exports = webpackConfig;
