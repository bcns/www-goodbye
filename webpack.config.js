const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ctx = {
    dev: process.env.NODE_ENV !== 'production',
    srcDir: path.resolve(__dirname, 'src'),
    dstDir: path.resolve(__dirname, 'dist'),
    pages: ['index'],
};

module.exports = {
    mode: ctx.dev ? 'development' : 'production',
    entry: ctx.pages.reduce((entry, page) => {
        entry[page] = `${ctx.srcDir}/page/${page}.js`;
        return entry;
    }, {}),
    output: {
        path: ctx.dstDir,
        filename: ctx.dev ? 'static/[name].js' : 'static/[contenthash:10].js',
        chunkFilename: 'static/[id].js',
    },
    devServer: {
        static: {directory: `${ctx.srcDir}/public`},
        liveReload: true,
        hot: false,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg|svg|webp|webm|mp4|woff|woff2|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: ctx.dev ? 'static/[path][name][ext]' : 'static/[contenthash:10][ext]',
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: ctx.dev ? 'static/[name].css' : 'static/[contenthash:10].css',
            chunkFilename: 'static/[id].css',
        }),
        ...ctx.pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    filename: `${page}.html`,
                    template: `${ctx.srcDir}/page/${page}.html`,
                    chunks: [page],
                })
        ),
    ],
};
