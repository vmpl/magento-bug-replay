const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV ?? 'production',
    entry: {
        threads: './node_modules/threads/index.mjs',
        'threads/worker': './node_modules/threads/worker.mjs',
        dexie: './node_modules/dexie/import-wrapper.mjs',
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
