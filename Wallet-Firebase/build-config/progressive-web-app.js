const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    plugins: [
        new WorkboxPlugin.GenerateSW({
            // Old client not waits.
            clientsClaim: true,
            skipWaiting: true
        })
    ]
};