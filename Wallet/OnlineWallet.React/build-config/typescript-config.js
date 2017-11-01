const ts = require("awesome-typescript-loader");
const typescriptCheckerPlugin = new ts.CheckerPlugin();
const typescriptConfigPathsPlugin = new ts.TsConfigPathsPlugin();


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