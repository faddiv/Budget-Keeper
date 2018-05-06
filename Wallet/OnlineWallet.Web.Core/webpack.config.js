const path = require("path");
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var runMode = require("./build-config/run-mode");
const scssConfig = require("./build-config/scss-config")(runMode.cssOutput);
const htmlConfig = require("./build-config/html-config");
const vendorConfig = require("./build-config/vendor-config");
const variablesConfig = require("./build-config/variables-config")(runMode.production);
const typescriptConfig = require("./build-config/typescript-config");
const outputPath = "wwwroot";
module.exports = function (env) {
    console.log("env variable:", env);
    return [merge(scssConfig, htmlConfig, vendorConfig, typescriptConfig, variablesConfig,
        {
            entry: {
                "bundle": "./ClientApp/index.tsx"
            },
            output: {
                path: path.resolve(outputPath),
                publicPath: "/",
                filename: runMode.jsOutput
            },
            plugins: [
                new CleanWebpackPlugin([outputPath + "/*"])
            ],
            devtool: runMode.production ? undefined : 'source-map',
            devServer: {
                contentBase: "ClientApp",
                /**
                 * default false, if true .scss and .html changes trigger reload and also triggers FULL reload.
                 */
                watchContentBase: true,
                port: 4200,
                historyApiFallback: true,
                proxy: {
                    "/api/*": {
                        target: "http://localhost:56491",
                        secure: false
                    }
                }
            }
        })

    ];
};
