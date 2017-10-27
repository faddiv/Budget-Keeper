const HtmlWebpackPlugin = require('html-webpack-plugin');

var indexHtml = new HtmlWebpackPlugin({
    template: "./ClientApp/index.html"
});

/**
 * This file contains the html related webpack config.
 */
module.exports =
    {
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: {
                                minimize: true,
                                removeAttributeQuotes: false,
                                keepClosingSlash: true,
                                ignoreCustomFragments: [/\{\{.*?}}/,/\[.*?\]/],
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            indexHtml
        ]
    };