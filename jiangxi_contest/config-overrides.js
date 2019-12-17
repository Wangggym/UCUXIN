const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const webpack = require('webpack');

module.exports = function override(config, env) {
    let {UglifyJsPlugin} = webpack.optimize;
    let uglify = new UglifyJsPlugin({
        compress: {
            warnings: false,
            comparisons: false,
            drop_console: true
        },
        output: {
            comments: false,
            ascii_only: true,
        },
        sourceMap: false,
    });
    if (env === "production") {
        config.plugins.push(uglify);
    }
    config = injectBabelPlugin(['import', {libraryName: 'antd-mobile', style: 'css'}], config);
    config = rewireLess(config, env);
    return config;
}
