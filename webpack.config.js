const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV ?? 'production',
    devtool: 'source-map',
    entry: {
        threads: './node_modules/threads/index.mjs',
        'threads/worker': './node_modules/threads/worker.mjs',
        dexie: './node_modules/dexie/import-wrapper.mjs',
        rrweb: './node_modules/rrweb/dist/rrweb-all.js',
    },
    output: {
        filename: './[name].js',
        path: path.resolve('./view/frontend/web/js/lib'),
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                loader: 'babel-loader'
            }
        ]
    },
}
