const production = process.argv.indexOf('-p') > -1;
const devServer = process.argv.filter(v => v.indexOf("webpack-dev-server") > -1).length > 0;

console.log("production mode: " + production);
console.log("dev server mode: " + devServer);

/**
 * This file determines particular settings based on how the program started.
 */
module.exports = {
    production: production,
    devServer: devServer,
    cssOutput: devServer ? "site.css" : "site-[chunkhash].css",
    jsOutput: devServer ? "[name].js" : "[name]-[chunkhash].js",
};