const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const typescriptCheckerPlugin = new CheckerPlugin();
const typescriptConfigPathsPlugin = new TsConfigPathsPlugin();

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
                        }, {
                            loader: 'angular2-template-loader'
                        }
                    ]
                }
            ]
        },
        plugins: [
            typescriptCheckerPlugin
        ],
        devtool: 'source-map',
        resolve: {
            plugins: [
                typescriptConfigPathsPlugin
            ]
        }
    };