const webpack = require('webpack');

/**
 * This file inject variables into the code.
 */
module.exports = function (production) {
    return {
        plugins: [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(production)
            })
        ]
    };
}