const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'LaTeXTranspiler',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    // Other plugins...
    new CopyPlugin({
      patterns: [
        { from: 'test/settings/default.json', to: 'defaultconfig.json' },
      ],
    }),
  ],
  // devtool:"source-map"
};
