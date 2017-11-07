const Webpack = require('webpack');
var packagesConfig = require("../package.json");

/**
 * This file contains the 3rd party libraries related webpack config.
 */
module.exports = function vendorConfig(options) {

    options = Object.assign({}, {
        exclude: []
    }, options);

    var vendorChunk = new Webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity
    });
    var aggressiveMerge = new Webpack.optimize.AggressiveMergingPlugin();//For CommonsChunk
    var vendor = Object.getOwnPropertyNames(packagesConfig.dependencies).filter(v => options.exclude.indexOf(v) == -1);
    console.log("vendor:", vendor);

    return {
        entry: {
            "vendor": vendor
        },
        plugins: [
            vendorChunk,
            aggressiveMerge,
            new Webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(hu)$/)
        ]
    }
}