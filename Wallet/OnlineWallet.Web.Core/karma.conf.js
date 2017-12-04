var karmaWebpack = require("karma-webpack");
var webpack = require("webpack");
var merge = require('webpack-merge');

//const vendorConfig = require("./build-config/vendor-config")({});
const variablesConfig = require("./build-config/variables-config")(false);
const typescriptConfig = require("./build-config/typescript-config");
//const webpackConfig = require("./webpack.config");

function createWebpackConfig(env) {
    const webpackConfig = merge(typescriptConfig, variablesConfig, {
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
            "ClientApp/root.spec.ts"
            //"ClientApp/**/*.spec.ts"
            //"ClientApp/**/*.spec.tsx"
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
            'text/x-typescript': ['ts', 'tsx']
        },
        //preprocessors: {
        //    "**/*.ts": ["karma-typescript"],
        //    "**/*.tsx": ["karma-typescript"]
        //},
        preprocessors: {
            "ClientApp/root.spec.ts": ["webpack", "sourcemap"]
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        /*karmaTypescriptConfig: {
            bundlerOptions: {
                constants: {
                    PRODUCTION: false
                },
                entrypoints: /\.spec\.tsx?$/
            },
            tsconfig: "./tsconfig.json"
        },*/
        reporters: ["kjhtml"],
        browsers: ["Chrome"],
        port: 4201,
        webpack: createWebpackConfig(process.env),
        logLevel: config.LOG_WARN
    });
}
