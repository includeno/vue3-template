let path = require('path')
const webpack = require('webpack')

module.exports = {
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false,
    lintOnSave: true,// 是否在保存的时候检查
    devServer: {// 环境配置
        host: 'localhost',
        port: 8088,
        open: true, //配置自动启动浏览器
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
        }
    },
    test: /\.less$/,
    use: [
        {loader: "style-loader"},
        {loader: "css-loader"},
        {
            loader: await resolve('less-loader'),
            options: {
                implementation: "less",
                lessOptions: {
                    javascriptEnabled: true,
                },
            },
        },
    ],
    css:{
        preprocessOptions:{
            less:{
                charset:false,
                additionalData:path.resolve(__dirname, "./src/theme/theme.less")
            }
        },
    },
    // vue3.0
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("components", resolve("src/components"))
            .set("views", resolve("src/views"))
        // .set("base", resolve("baseConfig"))
        // .set("public", resolve("public"));
    },
}