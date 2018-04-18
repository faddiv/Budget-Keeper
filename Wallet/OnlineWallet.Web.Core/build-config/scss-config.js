var MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * This file contains the style related webpack config. (css, and assets)
 */
module.exports = function(cssOutput) {
    var extractTextPlugin = new MiniCssExtractPlugin({
        filename: cssOutput
    });
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
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
            extractTextPlugin
        ]
    };
};
    