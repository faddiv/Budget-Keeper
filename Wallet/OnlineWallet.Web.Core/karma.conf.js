var karmaWebpack = require("karma-webpack");
var webpack = require("webpack");
var merge = require('webpack-merge');

const variablesConfig = require("./build-config/variables-config")(false);
const typescriptConfig = require("./build-config/typescript-config");
// fix: Never make cross dependency reference. It makes reference undefined. TODO: find a solution to detect this type of error.

function createWebpackConfig(env) {
    const webpackConfig = merge(typescriptConfig, variablesConfig, {
        mode: "development",
        devtool: "inline-source-map",
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: null, // if no value is provided the sourcemap is inlined
                test: /\.(ts|js)x?($|\?)/i // process .js and .ts files only
            })
        ]
    });
    console.log("Use webpack config:", webpackConfig);
    return webpackConfig;
}

module.exports = function (config) {
    config.set({
        basePath: "",
        files: [
            {
                pattern: "ClientApp/webpack_test_entrypoint.ts",
                watched: false
            }
        ],
        exclude: [
            "ClientApp/index.tsx"
        ],
        frameworks: ["jasmine"],
        plugins: [
            "karma-webpack",
            "karma-sourcemap-loader",
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter"
        ],
        mime: {
            "text/x-typescript": ["ts", "tsx"]
        },
        preprocessors: {
            "ClientApp/webpack_test_entrypoint.ts": ["webpack", "sourcemap"]
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        reporters: ["kjhtml"],
        browsers: ["Chrome"],
        port: 4201,
        webpack: createWebpackConfig(process.env),
        logLevel: config.LOG_WARN
    });
}
