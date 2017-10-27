const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const typescriptCheckerPlugin = new CheckerPlugin();

/**
 * This file contains the typescript related webpack config.
 */
module.exports =
    {
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)(\?|$)/,
                    use: [
                        {
                            loader: "awesome-typescript-loader"
                        }
                    ]
                }
            ]
        },
        devtool: 'source-map',
        resolve: {
            plugins: [
                typescriptConfigPathsPlugin
            ]
        }
    };