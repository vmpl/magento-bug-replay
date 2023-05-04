const ThreadsPlugin = require('threads-plugin')
const path = require('path');
const glob = require('glob');

module.exports = {
    mode: process.env.NODE_ENV ?? 'production',
    entry: glob.sync('view/frontend/web/ts/js/**').map(it => `./${it}`),
    output: {
        filename: './[name].js',
        path: path.resolve('./view/frontend/web/js/')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: '/node_modules/',
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ThreadsPlugin()
    ],
    externals: {
        "tiny-worker": "tiny-worker"
    }
}
