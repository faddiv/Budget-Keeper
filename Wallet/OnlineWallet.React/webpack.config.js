const path = require("path");
const merge = require('webpack-merge');

var runMode = require("./build-config/run-mode");
const scssConfig = require("./build-config/scss-config");
const htmlConfig = require("./build-config/html-config");
const vendorConfig = require("./build-config/vendor-config")({
    exclude: ["bootstrap"]
});
const typescriptConfig = require("./build-config/typescript-config");

module.exports = function (env) {
    return [merge(scssConfig, htmlConfig, vendorConfig, typescriptConfig,
        {
            entry: {
                "bundle": "./ClientApp/index.tsx"
            },
            output: {
                path: path.resolve("wwwroot"),
                publicPath: "/",
                filename: runMode.jsOutput
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js"]
            },
            devServer: {
                contentBase: "ClientApp",
                /**
                 * default false, if true .scss and .html changes trigger reload and also triggers FULL reload.
                 */
                watchContentBase: true,
                port: 4201,
                historyApiFallback: true,
                /**
                 * default true, opens the root url.
                 */
                open: true
            }
        })

    ];
};