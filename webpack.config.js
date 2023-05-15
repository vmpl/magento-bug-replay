const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV ?? 'production',
    devtool: 'source-map',
    entry: {
        dexie: './node_modules/dexie/dist/dexie.js',
        'dexie-export-import': './node_modules/dexie-export-import/dist/dexie-export-import.mjs',
        'dexie-relationships': './node_modules/dexie-relationships/dist/index.min.js',
    },
    output: {
        filename: './[name].js',
        path: path.resolve('./view/base/web/js/lib'),
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-typescript"
                    ]
                }
            }
        ]
    },
}