// fix: Watch out for reference casing. This config cant run if wrong.

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
        frameworks: [
            "jasmine",
            "karma-typescript"
        ],
        plugins: [
            "karma-typescript",
            "karma-sourcemap-loader",
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
        reporters: [
            "kjhtml", 
            "karma-typescript"
        ],
        browsers: ["Chrome"],
        port: 4201,
        logLevel: config.LOG_WARN
    });
}
