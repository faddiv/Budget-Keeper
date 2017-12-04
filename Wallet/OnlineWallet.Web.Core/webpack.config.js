const path = require("path");
const merge = require('webpack-merge');

var runMode = require("./build-config/run-mode");
const scssConfig = require("./build-config/scss-config")(runMode.cssOutput);
const htmlConfig = require("./build-config/html-config");
const vendorConfig = require("./build-config/vendor-config")({
});
const variablesConfig = require("./build-config/variables-config")(runMode.production);
const typescriptConfig = require("./build-config/typescript-config");

module.exports = function (env) {
    console.log("env variable:", env);
    return [merge(scssConfig, htmlConfig, vendorConfig, typescriptConfig, variablesConfig,
        {
            entry: {
                "bundle": "./ClientApp/index.tsx"
            },
            output: {
                path: path.resolve("wwwroot"),
                publicPath: "/",
                filename: runMode.jsOutput
            },
            devtool: runMode.production ? undefined : 'source-map',
            devServer: {
                contentBase: "ClientApp",
                /**
                 * default false, if true .scss and .html changes trigger reload and also triggers FULL reload.
                 */
                watchContentBase: true,
                port: 4200,
                historyApiFallback: true,
                /**
                 * default true, opens the root url.
                 */
                open: true
            }
        })

    ];
};
