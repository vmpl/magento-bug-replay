const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV ?? 'production',
    devtool: 'source-map',
    entry: {
        threads: './node_modules/threads/index.mjs',
        'threads/worker': './node_modules/threads/worker.mjs',
        dexie: './node_modules/dexie/import-wrapper.mjs',
        'typescript-json-serializer': './node_modules/typescript-json-serializer/dist/index.cjs.js',
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
