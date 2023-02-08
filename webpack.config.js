const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);

  webpack.mergeWebpack({
    resolve: {
      fallback: {
        http: require.resolve('stream-http'),
        https: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        tty: require.resolve('tty-browserify'),
        os: require.resolve('os-browserify/browser'),
        assert: require.resolve('assert/'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      },
    },
  });

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return webpack.resolveConfig();
};
