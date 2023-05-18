var path = require('path')
var webpack = require('webpack')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var WebpackBar = require('webpackbar')
var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  mode: 'development',
  stats: {
    entrypoints: false,
    children: false,
  },
  entry: {
    index: path.resolve(__dirname, './src/index'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:10].bundle.js',
    globalObject: 'window',
    assetModuleFilename: 'assets/[name].[hash:6][ext]',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          // { loader: 'postcss-loader' },  // you can configurate it  in postcss.config.js if all options are same.
          {
            loader: 'postcss-loader',
            // this will throw error "options has an unknown property 'plugins'"
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              // modifyVars: getThemeVariables({
              //   dark: true,
              // }),
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/font/[name].[hash:6][ext]',
        },
      },
      {
        test: /\.html?$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[ext]',
        },
      },
      {
        test: /.(png|jpe?g|gif|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new MonacoWebpackPlugin({ languages: ['json', 'javascript', 'typescript', 'css'] }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}
