var runMode = require("./run-mode");

/**
 * This file contains the style related webpack config. (css, and assets)
 */
module.exports =
    {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: ["to-string-loader", "css-loader", "autoprefixer-loader", "sass-loader"]
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
        }
    };