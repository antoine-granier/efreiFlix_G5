const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const isProd = process.env.NODE_ENV === 'production';
const prodUrl = 'https://efrei-searchbar.vercel.app/'; 

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: isProd ? prodUrl : 'auto'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  devServer: {
    static : {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3006,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'searchbar',
      filename: 'remoteEntry.js',
      exposes: {
        './SearchBar': './src/SearchBar',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
          eager: true
        },
      },
    }),
  ],
}; 