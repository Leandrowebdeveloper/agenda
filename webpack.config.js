const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

require('dotenv').config();


module.exports = {
    mode: process.env.MODE,
    entry: './src/index.js',
    target: 'node',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public', 'javascripts'),
        clean: true,
        publicPath: '/',
    },
    plugins: [
        new NodemonPlugin({
            watch: path.resolve('./**/*'),
            env: {
                NODE_ENV: process.env.MODE,
            },
            ext: 'js,ejs,json',
        })
    ],
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            }
        }]
    },
    devtool: 'inline-source-map'
}