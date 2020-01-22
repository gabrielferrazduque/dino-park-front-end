const fs = require('fs');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const BASE_URL = process.env.DP_BASE_URL || '/';
const HTTPS_KEY = process.env.DP_HTTPS_KEY || false;
const HTTPS_CERT = process.env.DP_HTTPS_CERT || false;
const HTTPS = HTTPS_CERT &&
  HTTPS_KEY && {
    key: fs.readFileSync(HTTPS_KEY),
    cert: fs.readFileSync(HTTPS_CERT),
  };

module.exports = {
  productionSourceMap: false,
  filenameHashing: true,
  publicPath: BASE_URL,
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear().end();
  },
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json', '.gql', '.graphql'],
    },
    module: {
      rules: [
        // fixes https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.ftl$/,
          use: 'raw-loader',
        },
        {
          test: /\.svg$/,
          include: /src\/assets\//,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                esModule: false,
                publicPath: '/img/',
                spriteFilename: 'sprite.[hash:8].svg',
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                svgo: {
                  plugins: [],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [new SpriteLoaderPlugin()],
  },
  devServer: {
    https: HTTPS,
  },
};
