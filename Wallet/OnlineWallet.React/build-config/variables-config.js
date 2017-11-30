const webpack = require('webpack');
const runMode = require('./run-mode');

/**
 * This file inject variables into the code.
 */
module.exports =
{
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(runMode.production)
        })
    ]
};