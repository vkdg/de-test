require('dotenv/config')

const path = require('path')
const fs = require('fs')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist')
}

const PAGES_DIR = `${PATHS.src}/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

module.exports = {
    // mode: process.env.MODE || 'development',
    mode: 'development',
    externals: {
        paths: PATHS
    },
    entry: {
        app: [`${PATHS.src}/assets/js/index.js`, `${PATHS.src}/assets/scss/styles.scss`]
    },
    output: {
        filename: `assets/js/[name].min.js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    devServer: {
        allowedHosts: 'all',
        port: 5051,
        client: {
            logging: 'warn',
            overlay: {
                errors: true,
                warnings: true
            },
            progress: true,
            reconnect: true,
        },
        compress: true,
        hot: true,
        watchFiles: ['src/**/*'],
        static: {
            directory: path.join(__dirname, 'dist'),
            serveIndex: true
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        }, {
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }, {
            test: /\.(png|jpg|gif|svg)$/,
      		loader: 'file-loader',
      		options: {
        		name: '[name].[ext]'
      		}
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                { loader: MiniCssExtractPlugin.loader, options: { esModule: false } },
                { loader: 'css-loader', options: { sourceMap: true, url: false } },
                { loader: 'postcss-loader', options: { sourceMap: true, postcssOptions: { config: path.resolve(__dirname, "./postcss.config.js") } } },
                { loader: 'sass-loader', options: { sourceMap: true } }
            ]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                { loader: MiniCssExtractPlugin.loader, options: { esModule: false } },
                { loader: 'css-loader', options: { sourceMap: true, url: false } },
                { loader: 'postcss-loader', options: { sourceMap: true, postcssOptions: { config: path.resolve(__dirname, "./postcss.config.js") } } },
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `assets/css/[name].min.css`,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `${PATHS.src}/assets/img`,
                    to: `assets/img`
                },
                {
                    from: `${PATHS.src}/assets/fonts`,
                    to: `assets/fonts`
                }
            ]
        }),
        ...PAGES.map(
            page => 
                new HtmlWebpackPlugin({
                    hash: true,
                    publicPath: './',
                    lang: 'ru',
                    inject: 'body',
                    template: `${PAGES_DIR}/${page}`,
                    filename: `./${page}`,
                    meta: {
                        viewport: 'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1.0'
                    }
                })
        )
    ]
}
