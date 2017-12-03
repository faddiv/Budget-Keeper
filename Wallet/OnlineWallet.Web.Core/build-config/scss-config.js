var ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * This file contains the style related webpack config. (css, and assets)
 */
module.exports = function(cssOutput) {
    var scssExtractTextPlugin = new ExtractTextPlugin({
        filename: cssOutput
    });
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: scssExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ["css-loader", "autoprefixer-loader", "sass-loader"]
                    })
                },
                {
                    test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)(\?|$)/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            scssExtractTextPlugin
        ]
    };
};
    