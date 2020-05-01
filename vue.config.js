const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');
const dir = path.resolve(process.cwd(), 'dist');
const dist = path.resolve(process.cwd(), 'dist');
// const publicDir = path.resolve(process.cwd(), 'public');
// console.log(dist);
const publicPath = '/';
module.exports = {
  publicPath,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new GenerateSW({
        ignoreUrlParametersMatching: [
          /\/index\.html/
        ]
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          `${dir}/js/*`,
          `${dir}/css/*`,
          `${dir}/precache*.*`,
        ],
      }),
    ],
    optimization: {
      minimizer: isProd
        ? [
            new TerserPlugin({
              terserOptions: { compress: { drop_console: false } },
            }),
          ]
        : [],
    },
  },
};
