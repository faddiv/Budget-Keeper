//var webpack = require("karma-webpack");
//var merge = require('webpack-merge');

/*const vendorConfig = require("./build-config/vendor-config")({
    exclude: ["bootstrap"]
});*/
//const variablesConfig = require("./build-config/variables-config")(false);
//const typescriptConfig = require("./build-config/typescript-config");
//const webpackConfig = require("./webpack.config");

/*function createWebpackConfig(env) {
    const webpackConfig = merge(vendorConfig, typescriptConfig, variablesConfig);
    console.log("Use webpack config:", webpackConfig);
    return webpackConfig;
}*/

module.exports = function (config) {
    config.set({
        basePath: "",
        files: [
            "ClientApp/**/*.ts",
            "ClientApp/**/*.tsx"
        ],
        exclude: [
            "ClientApp/index.tsx"
        ],
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-typescript",
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter"
        ],
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
            "**/*.tsx": ["karma-typescript"]
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        karmaTypescriptConfig: {
            bundlerOptions: {
                constants: {
                    PRODUCTION: false
                },
                entrypoints: /\.spec\.tsx?$/
            },
            tsconfig: "./tsconfig.json"
        },
        reporters: ["kjhtml", "karma-typescript"],
        browsers: ["Chrome"],
        port: 4202,
        //webpack: createWebpackConfig(process.env),
        logLevel: config.LOG_WARN
    });
}